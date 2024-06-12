import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '@/models/server/service/BookService';
import createApiResponse from '@/models/server/response/apiResponse';
import { ReplyCommentRequestQuery } from '@/lib/types/response';

export default async function handleCurrentComment(req: NextApiRequest, res: NextApiResponse) {
   const { id: userId, slug: bookId, index } = req.query as unknown as ReplyCommentRequestQuery;
   const commentId = parseInt(index);
   const service = new BookService(userId as string, bookId as string);
   if (req.method === 'POST') {
      const { comment } = req.body as { comment: string };
      console.log('---------------------TESTING OUT-------------------');
      console.log('REPLYING THE COMMENT IS WORKING AS INTEDED');
      try {
         const comments = await service.handleReplyToComment(commentId, comment);
         const response = createApiResponse<typeof comments>(comments, {
            message: 'Updated comment successfully',
         });
         return res.status(200).json(response);
      } catch (err: any) {
         // the message is more than the maximum length
         if (err instanceof TypeError) {
            const errorResponse = createApiResponse(null, {}, { code: 400, message: err.message });
            return res.status(400).json(errorResponse);
         } else {
            // other error
            const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
            return res.status(404).json(errorResponse);
         }
      }
   }
   if (req.method === 'DELETE') {
      try {
         service.deleteCommentById(commentId);
         return res.status(204).end();
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }

   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
