import { ReplyCommentRequestQuery } from '@/lib/types/response';
import createApiResponse from '@/models/server/response/apiResponse';
import BookService from '@/models/server/service/BookService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function upvote(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId, slug: bookId, index } = req.query as unknown as ReplyCommentRequestQuery;
      const parsedIdx = parseInt(index);
      const service = new BookService(userId as string, bookId as string);
      if (req.method === 'POST') {
         try {
            await service.handleUpvoteComment(parsedIdx);
            const response = createApiResponse(null, {
               message: 'Successfully upvoted',
            });
            return res.status(200).json(response);
         } catch (err: any) {
            const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
            return res.status(404).json(errorResponse);
         }
      }
      const errorResponse = createApiResponse(null, {}, { code: 500 });
      res.status(500).json(errorResponse);
   }
}
