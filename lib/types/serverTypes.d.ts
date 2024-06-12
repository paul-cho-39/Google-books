/** TODO: Migrate this to response.d.ts */
import { BookState, Rating } from '@prisma/client';
import { GoogleUpdatedFields, Items, Pages } from './googleBookTypes';
import { BestSellerData, ReviewData } from './nytBookTypes';
import { DefaultSession } from 'next-auth';
import { MetaDataParams } from './response';
import { Library } from './models/books';

// types for serverside props
export type BasicServerProps = {
   // userId: string | null;
   user: Session | null;
   id: string;
};

export interface RatingInfo {
   userId: string;
   bookId: string;
   dateAdded: Date;
   ratingValue: number;
   dateUpdated: Date;
}

export interface RatingData {
   count: number;
   avg: number;
   inLibrary: boolean;
}

// contains all ratings of a book
export interface MultipleRatingData extends RatingData {
   ratingInfo: RatingInfo[] | undefined;
}

// contains single rating for a user
export interface SingleRatingData extends RatingData {
   ratingInfo: RatingInfo | undefined | null;
}

export type RateServerTypes = BasicServerProps & {
   placerData?: MultipleRatingData | null;
};

type CombinedData = {
   displayName?: string;
   weeks_on_list?: number;
   bestsellers_date?: string;
} & Items<any>;

// home/index.ts - front page
export type CategoriesDataParams = Record<string, Pages<any> | null>;
export type CategoryQuery = Record<string, GoogleUpdatedFields | null>;
export type CategoriesNytQueries = Record<string, ReviewData<BestSellerData>>;
export type CategoriesQueries = Record<string, CombinedData[] | null>;

export type TestingCategoriesQueries = {
   category: string;
   data: CombinedData[] | undefined | null;
   isLoading: boolean;
   isError: boolean;
};

export interface CustomSession extends DefaultSession {
   id: string | null | undefined;
}

export interface ReturnedCacheData<Data extends GoogleUpdatedFields | ReviewData<BestSellerData>> {
   cacheStatus: Record<string, string | number>;
   data: Data;
   lastUpdated: string;
   source: 'cache' | 'api';
}

type ResponseBase = {
   success: boolean;
   meta: MetaDataParams;
};

export type ResponseRatingData = ResponseBase & {
   data: MultipleRatingData | null;
};

export type ResponseFinishedData = ResponseBase & {
   data: Library;
};
