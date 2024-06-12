import queryKeys from '@/utils/queryKeys';
import { AddedCommentResponseData, CommentPayload, CommentResponseData } from '../types/response';
import { QueryClient } from '@tanstack/react-query';
import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { CustomStateType } from '../hooks/useMutateComment';
/**
 * @description
 * Poll is an object that stores all the polling function. When any of the comment is added, it polls the most recent changed id and matches against it
 * before invalidating the cache key.
 */

interface KeyParams {
   bookId: string;
   pageIndex: number;
   queryClient: QueryClient;
   maxAttempts?: number;
   interval?: number;
}

interface PollCommentParams extends KeyParams {
   data: AddedCommentResponseData['data'];
   setState: Dispatch<SetStateAction<CustomStateType>>;
}

const poll = {
   pollNewComment: async ({
      data,
      bookId,
      pageIndex,
      queryClient,
      setState,
      maxAttempts = 7,
      interval = 1500,
   }: PollCommentParams) => {
      let attempts = 0;
      const commentId = data.id;
      setState('loading');

      // increments attempts at every fetch attempts
      const intervalId = setInterval(async () => {
         attempts++;
         // if attempts exceed maxAttempts it returns false
         // if it reconnects it will post the comment on the next hit
         if (attempts > maxAttempts) {
            setState('idle');
            clearInterval(intervalId);
            return;
         }

         const reviewData = queryClient.getQueryData<CommentPayload>(
            queryKeys.commentsByBook(bookId, pageIndex)
         );

         // comments data should be available if comments are posted
         if (!reviewData) {
            clearInterval(intervalId);
            setState('error');
         }

         console.log('THE REVIEW DATA HERE IS: ', reviewData);
         const reviewValidated = reviewData?.comments?.some((comment) => comment.id === commentId);

         // when found clear intervals
         // and react-query manages invaldiating the current query
         if (reviewData && reviewValidated) {
            clearInterval(intervalId);
            setState('success');
         } else {
            queryClient.fetchQuery(queryKeys.commentsByBook(bookId, pageIndex));
         }
      }, interval);
   },
};

export default poll;
