import { Book, BookState, Prisma, UserBook } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Data } from '@/lib/types/models/books';
import Books from './Books';

export type UserBookWithoutId = Omit<UserBook, 'userId' | 'bookId'>;
export type BookWithoutDeletion = Omit<Book, 'isDeleted' | 'dateDeleted'>;

export default class BookCreator extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }

   async createBook(data: Data) {
      await prisma.book.create({
         data: this.createDataObj(data),
      });
   }
   async upsertBookAndRating(data: Data, rating: number | string) {
      this.checkIds();
      const ratingNum = this.toNumber(rating);
      await prisma.$transaction(async (tx) => {
         await tx.session.findFirstOrThrow({
            where: { userId: this.userId },
         });

         await tx.book.upsert({
            where: { id: this.bookId },
            create: this.createDataObj(data),
            update: {
               ratings: {
                  upsert: {
                     where: { userId_bookId: this.getBothIds },
                     create: {
                        userId: this.userId,
                        ratingValue: ratingNum,
                     },
                     update: {
                        ratingValue: ratingNum,
                     },
                  },
               },
            },
         });
      });
   }

   async createBookAndComment(data: Data, content: string) {
      const comment = await prisma.$transaction(async (tx) => {
         try {
            // ensure that there is session
            await tx.session.findFirstOrThrow({
               where: { userId: this.userId },
            });

            // if book is created already skip creating the book
            const book = await tx.book.findUnique({
               where: { id: this.bookId },
            });

            if (!book) {
               // create the book before writing the comment
               await tx.book.create({
                  data: this.createDataObj(data),
               });
            }

            // create the comment after book has been created
            const comment = await tx.comment.create({
               data: {
                  bookId: this.bookId,
                  userId: this.userId,
                  content: content,
                  parentId: null, // parentId is set to null because there is no replied comment
               },
            });

            return comment;
         } catch (err) {
            throw new Error('Error while creating a new commnet');
         }
      });

      return comment;
   }
   /**
    *
    * @param parentId - the parentId should be the 'id' of the current comment
    * @param content - users content information
    */
   async replyToComment(commentId: number, content: string) {
      const reply = await prisma.$transaction(async (tx) => {
         // ensure that there is session and top comment in the database
         try {
            await tx.session.findFirstOrThrow({
               where: { userId: this.userId },
            });

            const parentComment = await tx.comment.findUniqueOrThrow({
               where: { id: commentId },
            });

            const repliedComment = await tx.comment.create({
               data: {
                  userId: this.userId,
                  bookId: this.bookId,
                  content: content,
                  parentId: parentComment?.id,
               },
            });

            return repliedComment;
         } catch (err) {
            throw new Error('Error while creating a reply to a comment');
         }
      });

      return reply;
   }

   /**
    * @todo Consider database locks or optimistic locking if volume of concurrent requests increase
    * and watch for race conditions. Have more robust testing for race conditions.
    * @param upvoteId - the id is the current 'id' of the comment
    */
   async upvoteComment(upvoteId: number) {
      await prisma.$transaction(async (tx) => {
         try {
            const currentUpvote = await tx.upvotes.findUnique({
               where: {
                  userId_upvoteId: {
                     upvoteId,
                     userId: this.userId,
                  },
               },
            });
            // if the user has already upvoted the current comment with the following id
            // then delete and decrement the 'likes'
            if (currentUpvote) {
               await tx.upvotes.delete({
                  where: { id: currentUpvote.id },
               });
               await tx.comment.update({
                  where: { id: upvoteId },
                  data: { likes: { decrement: 1 } },
               });
               // else create a new like and increment the 'likes'
            } else {
               await tx.upvotes.create({
                  data: {
                     userId: this.userId,
                     upvoteId: upvoteId,
                  },
               });
               await tx.comment.update({
                  where: { id: upvoteId },
                  data: { likes: { increment: 1 } },
               });
            }
         } catch (err) {
            throw new Error('Error while upvoting a comment');
         }
      });
   }

   async updateRatings(rating: number | string) {
      this.checkIds();
      const ratingNum = this.toNumber(rating);

      await prisma.$transaction(async (tx) => {
         await tx.session.findFirstOrThrow({
            where: { userId: this.userId },
         });
         // if user then can change the rating
         await tx.rating.upsert({
            where: {
               userId_bookId: this.getBothIds,
            },
            create: {
               bookId: this.bookId,
               userId: this.userId,
               ratingValue: ratingNum,
            },
            update: { ratingValue: ratingNum },
         });
      });
   }
   // due to createOrUpdateBookAndState upsert has slower performance creating a
   // should separate the method
   // if the user currently contains books and have IDs then return
   // then UPDATE the book
   async updateBookState(stateData: UserBookWithoutId) {
      await prisma.userBook.update({
         where: {
            userId_bookId: this.getBothIds,
         },
         data: {
            bookId: this.bookId,
            userId: this.userId,
            ...stateData,
         },
      });
   }
   // when the book is soft deleted and recovering back the book
   async createOrRecoverDeletedBook(data: Data, stateData: UserBookWithoutId) {
      await prisma.$transaction(async (tx) => {
         try {
            await tx.session.findFirstOrThrow({
               where: { userId: this.userId },
            });
            await tx.book.upsert({
               where: this.getBookId,
               update: {
                  isDeleted: false,
                  dateDeleted: null,
               },
               create: this.createDataObj(data),
            });
            await tx.userBook.upsert({
               where: { userId_bookId: this.getBothIds },
               update: { ...stateData },
               create: {
                  bookId: this.bookId,
                  userId: this.userId,
                  ...stateData,
               },
            });
         } catch (err) {
            console.error('Failed to complete the transaction', err);
         }
      });
   }

   private toNumber(rating?: number | string) {
      const numberToRating = Number(rating);

      if (!rating || isNaN(numberToRating)) {
         throw new Error('Required rating type is missing or have the wrong type');
      }
      return numberToRating;
   }
   private createDataObj(data: Data) {
      return {
         id: this.bookId,
         title: data.title,
         subtitle: data.subtitle,
         categories: data.categories ?? [],
         authors: data.authors ?? [],
         language: data.language,
         publishedDate: new Date(data.publishedDate),
         pageCount: data.pageCount,
         industryIdentifiers: (data.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
      };
   }
   private createDataAndConnect(data: Data, stateData: UserBookWithoutId) {
      return {
         ...this.createDataObj(data),
         users: {
            connectOrCreate: {
               where: { userId_bookId: this.getBothIds },
               create: {
                  userId: this.userId,
                  ...stateData,
               },
            },
         },
      };
   }
}
