import { Suspense, lazy, useContext, useMemo, useRef, useState } from 'react';
import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import { getSession } from 'next-auth/react';

import useInteractionObserver from '@/lib/hooks/useIntersectionObserver';
import createUniqueDataSets from '@/lib/helper/books/filterUniqueData';
import { FilterProps, Items } from '@/lib/types/googleBookTypes';
import useInfiniteFetcher from '@/lib/hooks/useInfiniteFetcher';
import { CustomSession } from '@/lib/types/serverTypes';

import BookSearchSkeleton from '@/components/loaders/bookcardsSkeleton';
import EmptyResult from '@/components/error/emptyResult';
import { MetaProps } from '@/models/_api/fetchGoogleUrl';
import FilterInput from '@/components/inputs/filter';
import { Divider } from '@/components/layout/dividers';
import SearchLayoutPage from '@/components/layout/searchLayout';
import Spinner from '@/components/loaders/spinner';
import useDecodeSearchRoute from '@/lib/hooks/useDecodeSearchRoute';

const Cards = lazy(() => import('@/components/bookcards/cards'));

export default function Search(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { userId, session } = props;

   // routed from search from /headers
   // decode the search here
   const { search, filter } = useDecodeSearchRoute();

   const pageLoader = useRef<HTMLDivElement>(null);

   const meta = (page: number): MetaProps => {
      return {
         maxResultNumber: 15,
         pageIndex: page ?? 0,
         byNewest: false,
      };
   };

   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteFetcher({ search, filter, meta });

   useInteractionObserver({
      enabled: !!hasNextPage,
      onIntersect: fetchNextPage,
      target: pageLoader,
   });

   // filtering duplicated results
   // and because of this 'totalItems' is not true number
   const uniqueDataSets: Array<Items<any>> = useMemo(
      () => data?.pages && data?.pages[0] && createUniqueDataSets(data),
      [data]
   );

   const totalItems: number = data?.pages?.[0]?.totalItems || 0;

   const renderLoadingState = () => (
      <SearchLayoutPage isSuccess={false}>
         <FilterInput />
         <Divider />
         <Spinner className='mt-24' />
      </SearchLayoutPage>
   );

   const renderEmptyOrErrorState = () => (
      <EmptyResult isError={isError} query={search} filter={filter}>
         <FilterInput />
      </EmptyResult>
   );

   const renderSuccessState = () => (
      <Suspense fallback={<BookSearchSkeleton books={5} />}>
         <Cards
            query={search}
            books={uniqueDataSets}
            userId={userId}
            totalItems={totalItems}
            filter={filter}
         />
      </Suspense>
   );

   // when theres no data and it is loading/fetching it is in a loading state
   if (!data && (isLoading || isFetching)) return renderLoadingState();

   // if totalItems array is empty or if there is an error then return an empty state
   if (!data || isError || ((!isLoading || !isFetching) && totalItems < 1)) {
      return renderEmptyOrErrorState();
   }

   return (
      <SearchLayoutPage isSuccess={true}>
         <main>
            <FilterInput />
            <div>
               {/* this also works with interaction observer */}
               {isFetching && isLoading ? (
                  <BookSearchSkeleton books={5} />
               ) : (
                  isSuccess && renderSuccessState()
               )}
            </div>
         </main>
         <div ref={pageLoader}></div>
      </SearchLayoutPage>
   );
}

export const getServerSideProps = async (context: any) => {
   const session = await getSession(context);

   const user = session?.user as CustomSession;
   const userId = user?.id || null;
   return {
      props: {
         session: session,
         userId: userId,
      },
   };
};
