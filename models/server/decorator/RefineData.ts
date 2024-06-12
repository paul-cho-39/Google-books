import prisma from '@/lib/prisma';
import { Book, UserBook } from '@prisma/client';
import { RefinedBookState, Library } from '@/lib/types/models/books';
import { MultipleRatingData, RatingInfo } from '@/lib/types/serverTypes';
import { CommentData } from '@/lib/types/response';

type AllUserBooks = (UserBook & {
   book: Book;
})[];

// keep it decouped in general to maintain cleaner code
// refines data and acts more like a decorator;
export class RefineData {
   constructor() {}

   refineBooks(userBooks: AllUserBooks) {
      const library: Library = {
         finished: [],
         reading: [],
         want: [],
         unfinished: [],
      };

      userBooks.forEach((ub) => {
         const key = ub.state.toLocaleLowerCase() as RefinedBookState;
         library[key]?.push(ub.book.id);
      });

      library['unfinished'] = [...(library.reading || []), ...(library.want || [])];

      return library;
   }

   refineDates<T>(data: T) {
      if (data instanceof Date) {
         return data.toISOString() as unknown as T;
      }

      // add an array type if needed
      // and can separate the logic into different functions depending on the data type?
      if (typeof data === 'object' && data !== null) {
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
               (data as T)[key] = this.refineDates((data as T)[key]);
            }
         }
      }

      return data;
   }
   /**
    * Since the application itself is small, it will be okay to fetch replies altogether. If the application is becomes
    * it will have to fetch replies separately and load them on event based user action.
    * @description Refines the currnet Comment data and adds 'upvoteCount' for each comment.
    * @param bookId
    * @param page
    * @param limit
    * @returns {Comments}
    */
   async getCommentsByBookId(bookId: string, page: number, limit: number = 10) {
      const skip = (page - 1) * limit;
      // contains total number of comments by `bookId` and all books associated with the `bookId`
      const [totalCount, comments] = await Promise.all([
         prisma.comment.count({
            where: { bookId: bookId },
         }),
         prisma.comment.findMany({
            where: { bookId: bookId },
            take: limit,
            skip: skip,
            orderBy: { dateAdded: 'desc' },
            include: {
               replies: {
                  include: {
                     replies: true,
                     user: { select: { name: true, username: true, image: true } },
                  },
               },
               upvote: true,
               _count: true,
               user: { select: { name: true, username: true, image: true } },
            },
         }),
      ]);

      // refine comments with upvoteCount for each comment
      const refinedComments = comments.map((comment) => ({
         ...comment,
         upvoteCount: comment.upvote.length,
      }));

      return {
         total: totalCount,
         comments: refinedComments,
      };
   }
   /**
    *
    * @param {Array}ratingData
    * @param {Array}commentData
    * @returns {Array}CommentData
    */
   addRatingToComments(
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
}

//
const refiner = new RefineData();
export default refiner;
