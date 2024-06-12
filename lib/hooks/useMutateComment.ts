import { Dispatch, SetStateAction, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
   ActionCommentType,
   CommentDataType,
   MutationAddCommentParams,
   MutationCommentParams,
   NewCommentBody,
} from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import queryKeys from '@/utils/queryKeys';
import { AddedCommentResponseData, CommentPayload } from '../types/response';
import poll from '../helper/poll';
import toast from 'react-hot-toast';
import TOAST_MESSAGE from '@/constants/toast';

import { UserAlreadyCommentedError } from '@/models/errors';

export type CustomStateType = 'idle' | 'error' | 'loading' | 'success';

export default function useMutateComment<AType extends ActionCommentType>(
   params: AType extends 'review' ? MutationCommentParams : MutationAddCommentParams,
   // customState: CustomStateType,
   // setCustomState: Dispatch<SetStateAction<CustomStateType>>,
   scrollToDisplaySection: () => void,
   action: AType
) {
   const { bookId, userId, pageIndex } = params;
   const queryClient = useQueryClient();

   const currentCommentData = queryClient.getQueryData<CommentPayload>(
      queryKeys.commentsByBook(params.bookId, params.pageIndex)
   );

   const [customState, setCustomState] = useState<CustomStateType>('idle');
   const containsComment = hasUserId(userId, currentCommentData);

   // TODO: if the user has already left a comment the user is only allowed to leave replies(?)
   //    if the user already left the comment then ask the user if they want to update the comment

   const getUrl = () => {
      if (action === 'review') {
         // type asserting so that it can recognize 'MutationCommentParams'
         const reviewParams = params as MutationCommentParams;
         return API_ROUTES.COMMENTS.REPLY(userId, bookId, reviewParams.commentId.toString());
      } else {
         return API_ROUTES.COMMENTS.ADD(userId, bookId);
      }
   };

   const {
      mutate,
      isLoading: isMutateLoading,
      isError: isMutateError,
   } = useMutation(
      async (data: CommentDataType<AType>) => {
         // the user has already commented
         // this does not pertain to replies
         if (hasUserId(userId, currentCommentData)) {
            throw new UserAlreadyCommentedError('User has already made a comment.');
         }

         const res = (await apiRequest({
            apiUrl: getUrl(),
            method: 'POST',
            data: data,
            shouldRoute: false,
         })) as AddedCommentResponseData; // both api will provide the same response

         return res;
      },
      {
         onSuccess: ({ data }) => {
            // ensuring that the new comment has been fetched
            // because of latency there will be delay and here it manually introduces a delay
            poll.pollNewComment({
               data,
               bookId,
               pageIndex,
               setState: setCustomState,
               queryClient,
            });

            // once new comment has been posted, it will scroll to the top of the comment
            if (customState === 'idle' || customState === 'success') {
               scrollToDisplaySection();
            }
         },
         onError: (error: Error) => {
            if (error instanceof UserAlreadyCommentedError) {
               toast.error(TOAST_MESSAGE.comment.duplicate.error);
            } else {
               toast.error(TOAST_MESSAGE.comment.add.error);
            }
         },
         onSettled: (data) => {
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex));
         },
      }
   );

   const isLoading = customState === 'loading' || isMutateLoading;
   const isError = customState === 'error' || isMutateError;

   return { mutate, isLoading, isError };
}

// helper function for finding the current userId
function hasUserId(userId: string, currentCommentData: CommentPayload | undefined) {
   // it returns false since there are no data
   if (!currentCommentData || !currentCommentData.comments) return false;
   const comments = currentCommentData.comments;
   return comments.some(
      (comment) =>
         // check it is not a reply
         !comment.parentId && comment.userId === userId
   );
}
