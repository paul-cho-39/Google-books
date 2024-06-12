import refiner, { RefineData, RefineData } from '@/models/server/decorator/RefineData';
import BookService from '@/models/server/service/BookService';
import { CommentDataType } from './models/books';

// for creating apiResponseError that will return 'ErrorResponse'
export interface ResponseErrorParams {
   code: number;
   message?: string;
}

export interface MetaDataParams {
   dateTime?: string;
   message?: string;
   options?: unknown;
}
// json payload when it runs into an error
interface ErrorResponse {
   data: null;
   meta?: MetaDataParams;
   success: boolean;
   error: ResponseError | undefined;
}

interface GetApiResponse<TData> {
   data: TData;
   meta: MetaDataParams;
   success: boolean;
   // Other fields specific to GET responses
}

interface PostApiResponse<TData> {
   data: TData;
   meta: MetaDataParams;
   success: boolean;
   // Other fields specific to POST responses
}

// specifying data response when 'GET' and 'POST'
type MethodSpecificApiResponse<TMethod extends 'GET' | 'POST', TData> = TMethod extends 'GET'
   ? GetApiResponse<TData>
   : TMethod extends 'POST'
   ? PostApiResponse<TData>
   : never;

type CustomApiResponse<TMethod extends 'GET' | 'POST', TData> = TData extends Error
   ? ErrorResponse
   : MethodSpecificApiResponse<TMethod, TData>;

export interface RatingResponseData {
   totalRatings?: number;
   avgRatings?: number;
}

type GetResponseData<TData> = Awaited<ReturnType<TData>>;

export interface UserIdAndBookIdQuery {
   id: string;
   slug: string;
}

// the parentId is equal to the index
export interface ReplyCommentRequestQuery extends UserIdAndBookIdQuery {
   index: string;
}

export interface CommentsRequestQuery extends UserIdAndBookIdQuery {
   page: string;
}

export type Upvote = {
   userId: string;
   id: number;
   upvoteId: number;
};

// export type CommentPayload = GetResponseData<RefineData['getCommentsByBookId']>;
export type CommentData = {
   _count: { upvote: number; replies: number };
   bookId: string;
   content: string;
   dateAdded: Date;
   dateUpdated: Date;
   id: number;
   likes: number;
   parentId: number | null;
   replies: CommentData[] | undefined;
   upvote: Upvote[];
   upvoteCount: number;
   user: {
      name: string | null;
      username: string | null;
      image: string | null;
   };
   userId: string;
   upvoteCount: number; // Added based on your mapping
   rating?: number;
};

export type CommentPayload = {
   total: number;
   comments: CommentData[];
};

type UpvotePayload = CommentPayload['upvote'];
export type CommentResponseData = PostApiResponse<CommentPayload>;
export type AddedCommentResponseData = PostApiResponse<
   GetResponseData<BookService['handleCreateCommentAndBook']>
>;
