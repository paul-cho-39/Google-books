import API_ROUTES from '@/utils/apiRoutes';
import apiRequest from '@/utils/fetchData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCommentBody, MutationBase, MutationCommentParams } from '../types/models/books';
import queryKeys from '@/utils/queryKeys';
import { AddedCommentResponseData } from '../types/response';

export default function useMutateUpdateComment(params: MutationCommentParams) {
   const { bookId, pageIndex, parentId, userId, commentId } = params;
   const queryClient = useQueryClient();
   const url = API_ROUTES.COMMENTS.UPDATE_COMMENT(commentId.toString(), userId);

   return useMutation(
      (data: AddCommentBody) =>
         apiRequest({
            apiUrl: url,
            method: 'POST',
            data: data,
         }),
      {
         onMutate: (data) => {},
         // on settle invalidate and refetch the comments again
         onSettled: () =>
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex)),
      }
   );
}
