import type { NextApiRequest, NextApiResponse } from 'next';

import BookService from '@/models/server/service/BookService';
import createApiResponse from '@/models/server/response/apiResponse';
import { Data } from '@/lib/types/models/books';

interface RequestBodyParams {
   data: Data;
   comment: string;
}

export default async function addComment(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const { data, comment } = req.body as RequestBodyParams;
      const service = new BookService(userId as string, bookId as string);

      try {
         const newComment = await service.handleCreateCommentAndBook(data, comment);
         const response = createApiResponse(newComment, {
            message: 'Successfully added comment',
         });
         return res.status(201).json(response);
      } catch (err: any) {
         if (err instanceof TypeError) {
            const errorResponse = createApiResponse(null, {}, { code: 400, message: err.message });
            return res.status(400).json(errorResponse);
         } else {
            const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
            return res.status(404).json(errorResponse);
         }
      }
   }

   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
