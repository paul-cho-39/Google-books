import API_ROUTES from '@/utils/apiRoutes';
import apiRequest from '@/utils/fetchData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentData, CommentPayload, CommentResponseData, UpvotePayload } from '../types/response';
import queryKeys from '@/utils/queryKeys';
import { MutationUpvoteParams } from '../types/models/books';

// CONSIDER: it may be better to flatten out the upvote data only and only refetch that data
// so that it does not have to re-fetch data with deep nested object especially when data gets larger
export default function useMutateUpvote({
   userId,
   bookId,
   commentId,
   pageIndex,
}: MutationUpvoteParams) {
   const queryClient = useQueryClient();

   return useMutation(
      () =>
         apiRequest({
            apiUrl: API_ROUTES.COMMENTS.UPVOTE(userId, bookId, commentId.toString()),
            method: 'POST',
            shouldRoute: false,
         }),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.commentsByBook(bookId, pageIndex));

            const prevComments = queryClient.getQueryData<CommentPayload>(
               queryKeys.commentsByBook(bookId, pageIndex)
            );

            // if there is no comments, users cannot upvote
            if (prevComments) {
               const commentsData = setOptimisticData(prevComments.comments, commentId, userId);
               const prevCommentsData: CommentPayload = {
                  total: prevComments.total,
                  comments: [...commentsData],
               };
               // console.log('THE NEXT DATA IS: ', nextData);
               queryClient.setQueryData<CommentPayload>(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  prevCommentsData
               );
            }

            return { prevComments };
         },
         onError: (err, commentId, context) => {
            // Rollback on error
            if (context?.prevComments) {
               queryClient.setQueryData(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  context?.prevComments
               );
            }

            console.error('Failed to upvote: ', err);
            // return toast if an error happens
         },
         // onSuccess: () => {
         //    console.log('Successfully upvoted the book!');
         // },
         onSettled: () => {
            // invaldiate the current comments and refetch again
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex));
         },
      }
   );
}

function setOptimisticData(
   comments: CommentData[],
   commentId: number,
   userId: string
): CommentData[] {
   // if (!comments) return;  // no comments

   return comments.map((comment) => {
      if (comment.id === commentId) {
         const userUpvoteIndex = comment.upvote.findIndex((upvote) => upvote.userId === userId);
         let currentUpvote = comment?._count.upvote;
         let updatedUpvotes = [...comment.upvote];
         let updatedUpvoteCount = comment.upvoteCount;

         if (userUpvoteIndex > -1) {
            // user has already upvoted, so remove their upvote
            updatedUpvotes.splice(userUpvoteIndex, 1);
            updatedUpvoteCount--;
            currentUpvote--;
         } else {
            // user hasn't upvoted yet, so add their upvote

            // find the max then upvote
            const tempId = Math.max(0, ...comment.upvote.map((u) => u.id));
            const newUpvote: UpvotePayload[number] = { id: tempId, upvoteId: comment.id, userId };
            updatedUpvotes.push(newUpvote);
            updatedUpvoteCount++;
            currentUpvote++;
         }

         return {
            ...comment,
            upvote: updatedUpvotes,
            upvoteCount: updatedUpvoteCount,
            _count: {
               ...comment._count,
               upvote: currentUpvote,
            },
         };
      } else if (comment.replies) {
         // recursively update replies
         return {
            ...comment,
            replies: setOptimisticData(comment.replies, commentId, userId),
         };
      }
      return comment;
   });
}
