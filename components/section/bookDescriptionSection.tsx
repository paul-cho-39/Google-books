import { MultipleRatingData } from '@/lib/types/serverTypes';
import SingleOrMultipleAuthors from '../bookcover/authors';
import BookDetails from '../bookcover/bookDetails';
import BookPublisher from '../bookcover/publisher';
import BookTitle from '../bookcover/title';
import useGetBookRatings from '@/lib/hooks/useGetBookRatings';
import DisplayRating from '../bookcover/ratings';
import { Items } from '@/lib/types/googleBookTypes';
import FilterStatus from '../bookcards/search/filterStatus';
import useGetBookData from '@/lib/hooks/useGetBookData';
import useLibraryChangeToaster from '@/lib/hooks/useGetToaster';
import MyToaster from '../bookcards/toaster';

// lazy load this part

interface BookDescriptionSectionProps {
   data: Items<any>;
   allRatingData: MultipleRatingData | null | undefined;
   userId: string | null;
}

const BookDescriptionSection = ({ data, allRatingData, userId }: BookDescriptionSectionProps) => {
   const { avgRating, totalRatings } = useGetBookRatings(data, allRatingData);
   const { data: databooks, isSuccess, isError } = useGetBookData(userId as string);
   const { toasterAction } = useLibraryChangeToaster(userId, isSuccess);

   return (
      <>
         <MyToaster shouldDisplayIcon isAdded={toasterAction && toasterAction} />
         <div className='flex flex-col justify-start px-2 gap-y-2 md:col-span-2'>
            {userId && <FilterStatus bookId={data.id} library={databooks} />}
            <BookTitle
               id={data.id} // google book id
               hasLink={false}
               title={data?.volumeInfo.title as string}
               subtitle={data?.volumeInfo.subtitle}
               className='text-xl mb-1 lg:text-3xl md:font-bold'
            />
            <div className='mb-1'>
               <span className='text-slate-800 dark:text-slate-200'>By: </span>
               <SingleOrMultipleAuthors hoverUnderline={true} authors={data?.volumeInfo.authors} />
            </div>
            <BookPublisher
               date={data?.volumeInfo.publishedDate}
               className='mb-1 lg:mb-1 text-md dark:text-slate-100'
            />
            <DisplayRating totalReviews={totalRatings} averageRating={avgRating} size='large' />
            <BookDetails
               categories={data?.volumeInfo.categories}
               page={data?.volumeInfo.pageCount}
               publisher={data?.volumeInfo.publisher}
               language={data?.volumeInfo.language}
               infoLinks={data?.volumeInfo.infoLink}
               className='px-6 py-4 md:py-8 lg:py-12'
            />
         </div>
      </>
   );
};

export default BookDescriptionSection;
