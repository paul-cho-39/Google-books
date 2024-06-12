import type { NextApiRequest, NextApiResponse } from 'next';
import createApiResponse from '@/models/server/response/apiResponse';
import refiner from '@/models/server/decorator/RefineData';

export default async function getComments(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { id: bookId, slug } = req.query as unknown as { id: string; slug: string };
      try {
         const pageIndex = parseInt(slug);
         const comments = await refiner.getCommentsByBookId(bookId, pageIndex);

         const response = createApiResponse<typeof comments>(comments, {});
         return res.status(200).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }

   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
