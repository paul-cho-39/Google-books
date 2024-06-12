import { UseQueryResult } from '@tanstack/react-query';
import { CommentData, CommentPayload, ErrorResponse } from '../types/response';
import { BaseIdParams, MutationCommentParams } from '../types/models/books';

function getMutationParams(
   result: CommentData,
   params: BaseIdParams,
   pageIndex: number
): MutationCommentParams {
   const commentId = result.id;
   const parentId = result.parentId || NaN;
   return {
      commentId,
      parentId,
      pageIndex,
      ...params,
   };
}

export default getMutationParams;
