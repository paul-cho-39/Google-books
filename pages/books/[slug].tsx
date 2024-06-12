import { ReactElement, Suspense, lazy, useMemo, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { getBookWidth } from '@/lib/helper/books/getBookWidth';
import { CustomSession, RateServerTypes, MultipleRatingData } from '@/lib/types/serverTypes';
import useGetBookById from '@/lib/hooks/useGetBookById';
import useHandleRating from '@/lib/hooks/useHandleRating';
import { CategoryRouteParams, RouteParams } from '@/lib/types/routes';
import { findId, useGetRating } from '@/lib/hooks/useGetRatings';

import refiner, { RefineData } from '@/models/server/decorator/RefineData';
import BookService from '@/models/server/service/BookService';

import BookImage from '@/components/bookcover/bookImages';
import BookActionButton from '@/components/buttons/bookActionButton';
import PageLayout from '@/components/layout/page/bookPageLayout';
import useSearchFilter from '@/lib/hooks/useSearchFilter';

import type { NextPageWithLayout } from './../_app';
import DescriptionSection from '@/components/contents/books/description';
import getUserInfo, { getUserName } from '@/lib/helper/getUserId';
import { BookTopLayout, BookBottomLayout } from '@/components/layout/bookLayout';
import Spinner from '@/components/loaders/spinner';
// import useGetReviews from '@/lib/hooks/useGetReviews';

const HEIGHT = 225;

const BookMetaDescriptionSection = lazy(
   () => import('@/components/section/bookDescriptionSection')
);
const ActiveRatingLazy = lazy(() => import('@/components/rating/activeRating'));
const ReviewSectionLazy = lazy(() => import('@/components/contents/books/review'));

// when refreshed the serversideProps will fetch the data
// when navigating between pages and coming back useQuery to check
const BookPage: NextPageWithLayout<
   InferGetServerSidePropsType<typeof getServerSideProps> & { isLoading: boolean; title: string }
> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { id, user, placerData } = props;

   const { userId, photoUrl } = getUserInfo(user);
   const currentUserName = getUserName.bySession(user);

   const router = useRouter();
   const { filter } = useSearchFilter(); // returns the current filter
   const query = router.query as CategoryRouteParams | RouteParams;

   const { data, isSuccess, isLoading } = useGetBookById({ routeParams: query, filter: filter });

   // TEST whether multiple users updating will have the same effect for updating
   const { data: allRatingData } = useGetRating({
      bookId: id,
      userId: userId as string,
      initialData: placerData,
   });

   // used for initializing the rating
   const userRatingData = useMemo(
      () => findId(allRatingData, userId as string),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [allRatingData]
   );

   // ALTER THIS IF THE LIBRARY DOES NOT CHANGE
   const params = {
      bookId: id,
      userId: userId as string,
      inLibrary: allRatingData?.inLibrary!,
      prevRatingData: userRatingData,
   };

   // takes care of all rating logic in this hook
   const handleRating = useHandleRating(
      {
         ...params,
         prevRatingData: userRatingData,
      },
      data,
      allRatingData
   );

   const ratingValue = userRatingData?.ratingInfo?.ratingValue;

   return (
      <PageLayout isLoading={isLoading} title={data?.volumeInfo?.title}>
         <BookTopLayout>
            <div className='flex flex-col items-center justify-center md:col-span-1 md:gap-x-0'>
               <BookImage
                  id={data?.id}
                  hidden={true}
                  bookImage={data?.volumeInfo?.imageLinks}
                  title={data?.volumeInfo.title as string}
                  height={HEIGHT}
                  width={getBookWidth(HEIGHT)}
                  priority
                  className='justify-center items-center'
               />
               <div className='flex flex-row w-full py-4 items-center justify-center'>
                  {isSuccess && data && (
                     <BookActionButton
                        className='justify-center px-2'
                        book={data}
                        userId={userId as string}
                     />
                  )}
               </div>
               <Suspense fallback={<Spinner size='md' />}>
                  <ActiveRatingLazy
                     userId={userId}
                     ratingValue={ratingValue}
                     handleResult={handleRating}
                     shouldDisplay={!!userRatingData}
                  />
               </Suspense>
            </div>
            <Suspense fallback={<div></div>}>
               <BookMetaDescriptionSection
                  allRatingData={allRatingData}
                  data={data}
                  userId={userId}
               />
            </Suspense>
         </BookTopLayout>

         {/* TODO: Suspense this part as well */}
         <BookBottomLayout>
            <DescriptionSection description={data?.volumeInfo?.description} />
            <Suspense fallback={<Spinner size='md' />}>
               <ReviewSectionLazy
                  avatarUrl={photoUrl}
                  currentUserName={currentUserName as string}
                  params={params}
                  bookData={data}
                  currentRatingValue={ratingValue}
                  handleRatingMutation={handleRating.handleMutation}
                  allRatingInfo={allRatingData?.ratingInfo}
               />
            </Suspense>
         </BookBottomLayout>
      </PageLayout>
   );
};

export const getServerSideProps: GetServerSideProps<RateServerTypes> = async (context) => {
   const { slug: bookId } = context.query as { slug: string };

   const session = await getSession(context);
   // const user = session?.user as CustomSession;
   // const userId = user?.id || null;

   const service = new BookService();
   const data = (await service.getAllRatingOfSingleBook(
      bookId
   )) as unknown as MultipleRatingData | null;

   // refines the date so it can be returned inside the SSR
   const refinedData = refiner.refineDates<MultipleRatingData | null>(data);

   return {
      props: {
         user: session,
         id: bookId,
         placerData: refinedData,
      },
   };
};

BookPage.getLayout = function getLayout(page: ReactElement) {
   const { isLoading, title } = page.props as { isLoading: boolean; title: string };

   return (
      <PageLayout isLoading={isLoading} title={title}>
         {page}
      </PageLayout>
   );
};

export default BookPage;
