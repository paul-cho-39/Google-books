import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRef, useState, lazy, Suspense, ReactElement, useMemo } from 'react';
import { ImageLinks } from '@/lib/types/googleBookTypes';
import classNames from 'classnames';

import { useGetCategoriesQueries } from '@/lib/hooks/useGetCategoryQuery';

import { Categories, NUM_CATEGORIES_LOAD, serverSideCategories } from '@/constants/categories';
import { getBookWidth, getContainerWidth } from '@/lib/helper/books/getBookWidth';

import { DescriptionSkeleton } from '@/components/loaders/bookcardsSkeleton';
import { CategoryDisplay } from '@/components/contents/home/categories';
import HomeLayout from '@/components/layout/page/homeLayout';

import layoutManager from '@/constants/layouts';
import { encodeRoutes } from '@/utils/routes';
import { batchFetchGoogleCategories } from '@/utils/fetchData';
import { CategoriesQueries, TestingCategoriesQueries } from '@/lib/types/serverTypes';
import { useGetNytBestSellers } from '@/lib/hooks/useGetNytBestSeller';
import useFloatingPosition from '@/lib/hooks/useFloatingPosition';
import useImageLoadTracker from '@/lib/hooks/useImageLoadTracker';
import getTotalItemsLength, { getBooksDataLength } from '@/lib/helper/getObjLength';
import type { NextPageWithLayout } from './_app';

import BookImage from '@/components/bookcover/bookImages';
import { DividerButtons } from '@/components/layout/dividers';
import { SwiperSlide } from '@/components/swiper';

const CategoryDescription = lazy(() => import('@/components/contents/home/categoryDescription'));

const MAX_RESULT = 6;
const TOTAL_COLS = 6;

const Home: NextPageWithLayout<
   InferGetStaticPropsType<typeof getStaticProps> & { isLoading: boolean }
> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
   const { data } = props;
   const [categoriesToLoad, setCategoriesToLoad] = useState(0);

   const categoryRefs = useRef<HTMLDivElement>(null);

   const meta = {
      maxResultNumber: MAX_RESULT,
      pageIndex: 0,
      byNewest: false,
   };

   const {
      cache,
      isGoogleDataSuccess,
      isGoogleDataLoading,
      categoriesWithResults: googleQueriesData,
   } = useGetCategoriesQueries({
      initialData: data,
      loadItems: categoriesToLoad, // load more items here
      enabled: !!data,
      meta,
      returnNumberOfItems: MAX_RESULT,
   });

   const { isNytDataLoading, categoriesWithResults: nytQueriesData } = useGetNytBestSellers({});

   // there is a slight delay so until the cache is registered it will use googleQueriesData
   const combinedData = useMemo(() => {
      if (!cache) {
         return [...nytQueriesData, ...googleQueriesData];
      } else {
         return [...nytQueriesData, ...cache];
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cache, googleQueriesData]);

   // get the entire bookIds and check the total number of items rendered
   const { handleImageLoad, areAllImagesLoaded, loadedImages } = useImageLoadTracker(
      getBooksDataLength(combinedData)
   );
   const areImagesLoadComplete = areAllImagesLoaded();

   const handleProcessData = () => {
      setCategoriesToLoad((prev) => prev + NUM_CATEGORIES_LOAD);
   };

   const {
      isEnabled,
      isHovered,
      floatingRef,
      largeEnabled,
      setImageRef,
      onMouseEnter,
      onMouseLeave,
      onMouseLeaveDescription,
   } = useFloatingPosition({
      totalCols: TOTAL_COLS,
      multiCols: false,
      enableOnMedScreen: false,
   });

   // images that are not server rendered are rendered later
   const HEIGHT = layoutManager.constants.imageHeight;

   const priorityCategories = ['FICTION', 'NONFICTION', ...serverSideCategories];
   const isPriority = (category: string) => priorityCategories.includes(category.toUpperCase());
   const isLoading = isNytDataLoading || isGoogleDataLoading;

   const getUniqueId = (id: string, cat: string) => {
      return id + cat;
   };

   return (
      <main>
         {combinedData.map(({ category, data, isLoading, isError }, index) => (
            <CategoryDisplay
               key={category}
               ref={categoryRefs}
               category={category as Categories}
               isError={isError}
               isLoading={isLoading}
            >
               {data &&
                  data?.map((book, index) => {
                     // disabled for smaller screens
                     const hoveredEl = isEnabled &&
                        isHovered.id == getUniqueId(book.id, category) &&
                        (isHovered.hovered || isHovered.isFloatHovered) && (
                           <div
                              key={book.id}
                              ref={floatingRef}
                              onMouseLeave={onMouseLeaveDescription}
                              style={{
                                 height: HEIGHT,
                                 width: getContainerWidth(
                                    HEIGHT,
                                    layoutManager.home.widthRatio,
                                    largeEnabled
                                 ),
                              }}
                              className='absolute z-40 rounded-lg'
                           >
                              {/* the description wont be ready until images are fully loaded */}
                              {areImagesLoadComplete && (
                                 <Suspense fallback={<DescriptionSkeleton />}>
                                    <CategoryDescription
                                       id={book.id}
                                       title={book.volumeInfo.title}
                                       subtitle={book.volumeInfo.subtitle}
                                       authors={book.volumeInfo.authors}
                                       description={book.volumeInfo.description}
                                       // TODO: with rating write a helper function for total reviews
                                       averageRating={book.volumeInfo?.averageRating}
                                       totalReviews={book.volumeInfo?.ratingsCount}
                                       routeQuery={encodeRoutes.home(category, meta)}
                                    />
                                 </Suspense>
                              )}
                           </div>
                        );
                     return (
                        <>
                           <SwiperSlide>
                              <BookImage
                                 key={book.id + 'image'}
                                 id={book.id}
                                 title={book.volumeInfo.title}
                                 width={getBookWidth(HEIGHT)}
                                 height={HEIGHT}
                                 ref={(el: HTMLDivElement) =>
                                    setImageRef(getUniqueId(book.id, category), el)
                                 }
                                 onMouseEnter={() =>
                                    onMouseEnter(getUniqueId(book.id, category), index)
                                 }
                                 bookImage={book.volumeInfo.imageLinks as ImageLinks}
                                 priority={isPriority(category)}
                                 onMouseLeave={(e: React.MouseEvent) =>
                                    onMouseLeave(e, floatingRef)
                                 }
                                 onLoadComplete={() => handleImageLoad(book.id, category)}
                                 routeQuery={encodeRoutes.home(category, meta)}
                                 className={classNames(
                                    // the description is shown and book image is hovered
                                    isHovered.hovered &&
                                       isHovered.id === getUniqueId(book.id, category)
                                       ? 'opacity-70'
                                       : 'opacity-100',
                                    'lg:col-span-1 px-4 lg:px-2 inline-flex items-center justify-center cursor-pointer'
                                 )}
                              />
                              {hoveredEl}
                           </SwiperSlide>
                           {/* <div>Hello</div> */}
                        </>
                     );
                  })}
            </CategoryDisplay>
         ))}
         {isGoogleDataSuccess && (
            <DividerButtons
               onClick={handleProcessData}
               numberToLoad={categoriesToLoad}
               isLoading={isLoading}
               title='Load More'
               aria-busy={isLoading}
            />
         )}
      </main>
   );
};

// change the categories later
// getSession() -> use userId right?
export const getStaticProps: GetStaticProps<{
   data: CategoriesQueries;
}> = async () => {
   const googleData = (await batchFetchGoogleCategories(serverSideCategories, {
      maxResultNumber: MAX_RESULT + 4, // there are duplicate data and to ensure there are at least six
      pageIndex: 0,
      byNewest: false,
   })) as CategoriesQueries;

   return {
      props: {
         data: googleData,
      },
      revalidate: 60 * 60 * 12,
   };
};

Home.getLayout = function getLayout(page: ReactElement) {
   const { isLoading } = page.props as { isLoading: boolean };

   return <HomeLayout isLoading={isLoading}>{page}</HomeLayout>;
};

export default Home;
