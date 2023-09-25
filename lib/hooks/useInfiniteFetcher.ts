import { useInfiniteQuery } from '@tanstack/react-query';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import queryKeys from '../queryKeys';
import { fetcher } from '../../utils/fetchData';
import { FilterProps } from '../types/googleBookTypes';

interface FetcherProps {
   search: string;
   filter: FilterProps;
   meta: (page: number) => MetaProps;
}

export default function useInfiniteFetcher({ search, filter, meta }: FetcherProps) {
   const getUrlFromFilter = (pageParam: number) => {
      const metaProps = meta(pageParam);

      const urlGenerators = {
         author: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  inauthor: search,
                  filter: filter.filterBookParams,
               },
               metaProps
            ),
         title: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  intitle: search,
                  filter: filter.filterBookParams,
               },
               metaProps
            ),
         isbn: () => googleApi.getUrlByIsbn(search),
      };

      const generate = urlGenerators[filter.filterBy];
      const url = generate();
      return url;
   };

   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteQuery(
         queryKeys.bookSearch(search.toLocaleLowerCase()),
         ({ pageParam = 0 as number }) => {
            const url = getUrlFromFilter(pageParam);
            return fetcher(url);
         },
         {
            getNextPageParam: (lastPage, allPages) => {
               // // google book api ordering is off
               // // tested and cannot seem to find the proper ordering?
               let pageParam = 1;
               if (lastPage && allPages) {
                  const totalAllPagesLength = allPages.length;
                  // console.log("THE TOAL LENGTH : ", totalAllPagesLength);
                  const lastPageItems = allPages[totalAllPagesLength - 1]?.totalItems;

                  if (lastPage.totalItems === lastPageItems) {
                     return totalAllPagesLength * pageParam;
                  } else {
                     return undefined;
                  }
               }
            },
            enabled: !!search,
            keepPreviousData: true,
         }
      );
   return {
      data,
      isLoading,
      isFetching,
      isError,
      isSuccess,
      hasNextPage,
      fetchNextPage,
   };
}
