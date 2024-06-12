import Comment, { CommentProps } from '@/components/comments/comment';
import { ForwardRefRenderFunction, forwardRef, useMemo, useState } from 'react';
import getMutationParams from '@/lib/helper/getCommentMutationParams';
import { BaseIdParams } from '@/lib/types/models/books';
import useGetReviews from '@/lib/hooks/useGetReviews';

import Pagination, { PaginationProps } from '@/components/headers/pagination';
import LoadingPage from '@/components/layout/loadingPage';
import { RatingInfo } from '@/lib/types/serverTypes';
import addRatingToComments from '@/lib/helper/addRatingsToComment';

interface DisplayReviewSectionProps extends Omit<CommentProps<BaseIdParams>, 'comment'> {
   pageIndex: number;
   scrollToComment: () => void;
   currentUserName: string;
   handlePageChange: PaginationProps['onPageChange'];
   allRatingInfo: RatingInfo[] | undefined;
}

/**
 *
 * @param props
 * @param ref
 * @returns
 */

const DisplayReviewSection: ForwardRefRenderFunction<HTMLDivElement, DisplayReviewSectionProps> = (
   props,
   ref
) => {
   const { scrollToComment, pageIndex, handlePageChange, ...rest } = props;

   const {
      data: reviewData,
      status,
      isLoading,
      isError,
   } = useGetReviews(props.params.bookId, pageIndex);

   const ITEMS_PER_PAGE = 10;
   const totalComments = reviewData?.total || 0;

   // const reviews = reviewData?.comments;

   const reviews = useMemo(
      () => addRatingToComments(props.allRatingInfo, reviewData?.comments),
      [props.allRatingInfo, reviewData?.comments]
   );

   if (isLoading) {
      return <LoadingPage />;
   }

   return (
      <section id='display_review'>
         <div ref={ref} className='py-2'>
            {/* No Comments here */}
            {!reviews ? (
               <NoCommentToDisplay scrollToComment={scrollToComment} />
            ) : (
               <ul role='listitem' className='flex flex-col my-6 gap-y-12'>
                  {reviews.map((review) => (
                     <article
                        key={review.id}
                        aria-roledescription='review'
                        className='first-of-type:border-none border-t-2 border-spacing-1 border-gray-500 dark:border-gray-400'
                     >
                        <Comment
                           {...rest}
                           params={getMutationParams(review, props.params, pageIndex)}
                           comment={review}
                        />
                     </article>
                     // if the user replies
                  ))}
               </ul>
            )}
            {reviews && totalComments > 10 && (
               <Pagination
                  currentPage={pageIndex}
                  totalItems={totalComments}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
               />
            )}
         </div>
      </section>
   );
};

const NoCommentToDisplay = (props: Pick<DisplayReviewSectionProps, 'scrollToComment'>) => {
   return (
      <div className='py-24 flex items-center justify-center'>
         <p className='text-xl lg:text-2xl'>
            Review is so empty. Be the first to{' '}
            <span
               role='navigation'
               onClick={props.scrollToComment}
               className='underline underline-offset-2 cursor-pointer'
            >
               review!
            </span>
         </p>
      </div>
   );
};

export default forwardRef(DisplayReviewSection);
