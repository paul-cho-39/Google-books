import { CommentData } from '../types/response';
import { RatingInfo } from '../types/serverTypes';

/**
 *
 * @param {Array}ratingData
 * @param {Array}commentData
 * @returns {Array}CommentData
 */
function addRatingToComments(
   ratingData: RatingInfo[] | undefined | null,
   commentData: CommentData[] | undefined
) {
   if (!commentData) return;
   if (!ratingData) {
      // early return of commentData
      return commentData;
   }

   const userIdToRating = new Map<string, number>();
   ratingData.forEach((ratingInfo) => {
      userIdToRating.set(ratingInfo.userId, ratingInfo.ratingValue);
   });

   const refinedComments = commentData.map((comment) => {
      if (userIdToRating.has(comment.userId)) {
         return { ...comment, rating: userIdToRating.get(comment.userId) };
      }
      return comment;
   });

   return refinedComments;
}

export default addRatingToComments;
