import API_ROUTES from '@/utils/apiRoutes';
import { fetcher } from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { CommentResponseData, CommentPayload, ErrorResponse } from '../types/response';

/**
 *
 * @param bookId
 */
export default function useGetReviews(bookId: string, page: number) {
   if (page <= 0) {
      throw new Error('The pageIndex has to be over 0.');
   }
   const idx = page.toString();

   return useQuery<CommentResponseData, ErrorResponse, CommentPayload>(
      queryKeys.commentsByBook(bookId, page),
      async () => {
         const res = await fetcher(API_ROUTES.COMMENTS.GET_COMMENTS(bookId, idx), {
            method: 'GET',
         });

         return res.data;
      },
      {
         enabled: !!bookId,
         keepPreviousData: true,
         // select: (data) => data.data,
         refetchIntervalInBackground: true,
         refetchOnReconnect: true,
         retry: 7,
         retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential back-off
      }
   );
}

// bookId

// ensure that the page number is not equal to 0
// function checkPageNumber() {}
