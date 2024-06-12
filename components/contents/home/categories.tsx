import Link from 'next/link';

import { capitalizeWords, formatCategoryName } from '@/lib/helper/transformChar';
import CategoryLayout, { CategoryLayoutProps } from '../../layout/page/categoryLayout';
import { CategoryHeaderParams } from '@/constants/categories';
import classNames from 'classnames';
import ROUTES from '@/utils/routes';
import { Fragment, forwardRef } from 'react';
import Spinner from '@/components/loaders/spinner';
import Swiper from '@/components/swiper';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';

// import { register } from 'swiper/element/bundle';

type CategoryDisplayProps = CategoryLayoutProps & {
   isLoading: boolean;
   isError: boolean;
};

export const CategoryDisplay = forwardRef<React.ElementRef<'div'>, CategoryDisplayProps>(
   function CategoryDisplay({ category, children, isLoading, isError, ...props }, ref) {
      /** TESTING OUT THE COMPONENTS */

      /** TO HERE!! */
      return (
         <CategoryLayout
            category={category}
            className='scrollbarX w-auto lg:w-full lg:overflow-hidden'
         >
            <CategoryHeader className='mb-4' category={category} />
            {/* if there is an error inside the section it will be specific to the section */}
            {isError ? (
               <div className='text-xl lg:text-2x text-black dark:text-slate-300'>
                  Sorry, there is an error fetching the data.
               </div>
            ) : // same with loading here
            isLoading ? (
               <div className='flex items-center justify-center'>
                  <Spinner size='md' color='indigo' />
               </div>
            ) : (
               <>
                  {/* <div ref={ref} className='relative lg:grid lg:grid-cols-6 container'>
                     {children}
                  </div> */}

                  {/* <Swiper
                     className='bg-blue-500 relative'
                     direction='horizontal'
                     slidesPerView={5}
                     spaceBetween={25}
                     centeredSlides={true}
                     
                     pagination={{
                        clickable: true,
                     }}
                     modules={[Pagination, Navigation]}
                  >
                     {children}
                  </Swiper> */}
                  <div ref={ref}>
                     <Swiper
                        direction='horizontal'
                        slidesPerView={5}
                        spaceBetween={5}
                        centeredSlides={false}
                        pagination={{
                           el: '.swiper-pagination',
                           type: 'bullets',
                           clickable: false,
                           hideOnClick: true,
                        }}
                        injectStyles={[
                           `
                           .swiper-button-next,
                           .swiper-button-prev {
                             background-color: white;
                             padding: 8px 8px;
                             
                             border-radius: 75%;
                             border: 1.5px solid black;
                             color: black;
                             width: 25px;
                             height: 25px;
                           }
                           .swiper-pagination-bullet{
                             width: 5px;
                             height: 5px;
                             background-color: black;
                           }
                       `,
                        ]}
                        navigation={true}
                     >
                        {children}
                     </Swiper>
                  </div>

                  <div className='text-left bg-fixed lg:px-4 lg:text-right'>
                     <ShowMoreCategory category={category} />
                  </div>
               </>
            )}
         </CategoryLayout>
      );
   }
);

// export const CategoryDisplay = forwardRef<React.ElementRef<'div'>, CategoryDisplayProps>(
//    function CategoryDisplay({ category, children, isLoading, isError, ...props }, ref) {
//       /** TESTING OUT THE COMPONENTS */

//       /** TO HERE!! */
//       return (
//          <CategoryLayout
//             category={category}
//             className='scrollbarX w-auto lg:w-full lg:overflow-hidden'
//          >
//             <CategoryHeader className='mb-4' category={category} />
//             {/* if there is an error inside the section it will be specific to the section */}
//             {isError ? (
//                <div className='text-xl lg:text-2x text-black dark:text-slate-300'>
//                   Sorry, there is an error fetching the data.
//                </div>
//             ) : // same with loading here
//             isLoading ? (
//                <div className='flex items-center justify-center'>
//                   <Spinner size='md' color='indigo' />
//                </div>
//             ) : (
//                <>
//                   <div ref={ref} className='relative lg:grid lg:grid-cols-6 container'>
//                      {children}
//                   </div>

//                   <div className='text-left bg-fixed lg:px-4 lg:text-right'>
//                      <ShowMoreCategory category={category} />
//                   </div>
//                </>
//             )}
//          </CategoryLayout>
//       );
//    }
// );

export const CategoryHeader = ({
   category,
   className,
}: {
   category: CategoryHeaderParams;
   className?: string;
}) => {
   const formattedCategory = formatCategoryName(category as string);
   return (
      <h2
         className={classNames(
            className,
            'font-sans uppercase mt-2 py-2 text-xl lg:text-xl text-slate-800 dark:text-slate-100'
         )}
      >
         <strong>{capitalizeWords(formattedCategory)}</strong>
      </h2>
   );
};

const ShowMoreCategory = ({ category }: { category: CategoryHeaderParams }) => {
   return (
      <Link
         aria-label='Show more categories'
         as={ROUTES.CATEGORIES(category as string)}
         href={'/categories/[slug]'}
         passHref
      >
         <a className='cursor-pointer inline-flex text-sm hover:opacity-80 hover:underline hover:underline-offset-1 hover:decoration-blue-600 dark:hover:decoration-blue-400'>
            <span className='text-blue-500'>
               More {capitalizeWords(category as string)} books...
            </span>
         </a>
      </Link>
   );
};
