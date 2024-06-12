import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import API_ROUTES from '@/utils/apiRoutes';
import { MutationBase, MutationCommentParams } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';
import TOAST_MESSAGE from '@/constants/toast';
import poll from '../helper/poll';
import { CommentPayload } from '../types/response';

export default function useMutateDelete(params: MutationCommentParams) {
   const { bookId, commentId, userId, pageIndex } = params;
   const queryClient = useQueryClient();

   const mutation = useMutation(
      () =>
         apiRequest({
            apiUrl: API_ROUTES.COMMENTS.DELETE(userId, bookId, commentId.toString()),
            method: 'DELETE',
         }),
      {
         onMutate: async () => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryKeys.commentsByBook(bookId, pageIndex));

            // Snapshot the previous value
            const previousComments = queryClient.getQueryData<CommentPayload>(
               queryKeys.commentsByBook(bookId, pageIndex)
            );

            // setting optimisitic comments where total is subtracted one
            // and filters the comments
            if (previousComments) {
               queryClient.setQueryData<CommentPayload>(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  {
                     ...previousComments,
                     total: previousComments.total - 1,
                     comments: previousComments.comments.filter(
                        (comment) => comment.id !== commentId
                     ),
                  }
               );
            }

            return { previousComments };
         },
         onError: (err, variables, context) => {
            // rollback on error
            if (context?.previousComments) {
               queryClient.setQueryData<CommentPayload>(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  context.previousComments
               );
            }
            console.error('Error while deleting comment:', err);
            toast.error(TOAST_MESSAGE.comment.delete.error);
         },

         onSuccess: (data, _, context) => {
            toast.success(TOAST_MESSAGE.comment.delete.success);
         },
         onSettled: () =>
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex.toString())),
      }
   );

   return mutation;
}
