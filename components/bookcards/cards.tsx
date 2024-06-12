import React, { lazy, Suspense } from 'react';
import { FilterProps, Items } from '@/lib/types/googleBookTypes';
import useGetBookData from '@/lib/hooks/useGetBookData';
import { Divider } from '../layout/dividers';
import BookListItem from './search/bookLists';
import useLibraryChangeToaster from '@/lib/hooks/useGetToaster';
import MyToaster from './toaster';
import classNames from 'classnames';

const Cards: React.FunctionComponent<{
   query: string;
   books: Array<Items<any>> | undefined;
   totalItems: number;
   filter: FilterProps;
   userId: string | null;
}> = ({ query, books, userId, filter, totalItems }) => {
   const { data: databooks, isSuccess, isError } = useGetBookData(userId as string);
   const { toasterAction } = useLibraryChangeToaster(userId, isSuccess);

   return (
      <>
         <MyToaster shouldDisplayIcon isAdded={toasterAction && toasterAction} />
         <div className=''>
            <TotalResults filter={filter} result={totalItems} />
            <Divider />
            <div className='mx-auto w-full lg:max-w-2xl'>
               <ul
                  aria-label='lists of book result'
                  role='listbox'
                  className='divide-y-[0.5px] divide-gray-300'
               >
                  {books &&
                     books?.map((book) => (
                        <BookListItem
                           key={book.id}
                           book={book}
                           query={query}
                           userId={userId}
                           dataBooks={databooks}
                        />
                     ))}
               </ul>
            </div>
         </div>
      </>
   );
};

export const TotalResults = ({ filter, result }: { filter: FilterProps; result: number }) => {
   const defaultFilter = filter?.filterBy === 'all';
   const defaultParams = filter?.filterParams === 'None';

   return (
      <h3
         aria-live='polite'
         data-testid='total-book-results'
         className='mb-4 font-secondary text-xl font-bold text-slate-800 dark:text-slate-100'
      >
         Results: <span>{result}</span>
         <span className={classNames(defaultFilter ? 'hidden' : 'ml-1 inline-flex')}>
            ({filter?.filterBy})
         </span>
      </h3>
   );
};

export default Cards;
