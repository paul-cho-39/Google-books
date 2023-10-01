import prisma from '../../../lib/prisma';
import { Book, BookState } from '@prisma/client';
import Books from './Books';

export default class BookRetriever {
   constructor() {}
   async getBooksByState(userId: string, state: BookState) {
      const userBooks = await prisma.userBook.findMany({
         where: {
            userId: userId,
            state: state,
         },
         include: {
            book: true,
         },
      });

      return userBooks.map((ub) => ub.book);
   }

   async getAllUserBooks(userId: string) {
      return await prisma.userBook.findMany({
         where: { userId: userId },
         include: {
            book: true,
         },
      });
   }
   async getAllRatingsFromUser(userId: string) {
      return await prisma.rating.findMany({
         where: { userId: userId },
      });
   }
   async getAllRatingsByBook(bookId: string) {
      return await prisma.userBook.findMany({
         where: { bookId: bookId },
      });
   }
   async getBatchRatings(bookIds: string[]) {
      return await prisma.rating.groupBy({
         by: ['bookId'],
         where: {
            bookId: {
               in: bookIds,
            },
         },
         _count: true,
         _avg: {
            ratingValue: true,
         },
      });
   }
}

// async getAllBooks() {
//     // for concurrently fetching all books
//     const books = await Promise.all([
//        await this.getIdsForBook<'finished'>(prisma.finished),
//        await this.getIdsForBook<'want'>(prisma.want),
//        await this.getIdsForBook<'reading'>(prisma.reading),
//     ]);
//     return {
//        library: {
//           finished: books[0],
//           wantToRead: books[1],
//           currentlyReading: books[2],
//        },
//     };
//  }
