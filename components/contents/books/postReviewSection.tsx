import { FormEvent, ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react';
import useMutateComment, { CustomStateType } from '@/lib/hooks/useMutateComment';
import { BaseIdParams, MutationAddCommentParams, NewCommentBody } from '@/lib/types/models/books';
import { Items } from '@/lib/types/googleBookTypes';
import CreateComment from '@/components/comments/createComment';
import ActiveRating from '@/components/rating/activeRating';
import { UseHandleRatingResult } from '@/lib/hooks/useHandleRating';
import MyToaster from '@/components/bookcards/toaster';

export interface PostReviewSectionProps<TParam extends MutationAddCommentParams | BaseIdParams> {
   params: TParam;
   bookData: Items<Record<string, string>>;
   scrollToDisplay: () => void;
   handleRatingMutation: UseHandleRatingResult['handleMutation'];
   currentRatingValue: number | undefined;
}

const PostReviewSection: ForwardRefRenderFunction<
   HTMLElement,
   PostReviewSectionProps<MutationAddCommentParams>
> = (props, ref) => {
   const [rating, setRating] = useState<null | number>(null);
   const [resetFlag, setResetFlag] = useState(false);

   const { bookId, pageIndex } = props.params;

   const { mutate, isLoading, isError } = useMutateComment(
      props.params,
      props.scrollToDisplay,
      'comment'
   );

   const handleMutation = (body: NewCommentBody) => {
      if (rating && rating > 0) {
         props.handleRatingMutation(rating, true);
      }

      mutate(body);

      // set the rating back to 0 for new comment
      setTimeout(() => {
         setRating(null);
         setResetFlag(true);
      }, 350);
   };

   // TODO: this is to sync with ActiveRating component
   // but there is probably a better way to do this like using `useReducer`
   useEffect(() => {
      let timerId: NodeJS.Timeout;
      if (resetFlag) {
         timerId = setTimeout(() => {
            setResetFlag((f) => !f);
         }, 200);
      }

      return () => clearTimeout(timerId);
   }, [resetFlag]);

   return (
      <section id='reviews' ref={ref}>
         <div className='relative max-w-2xl bg-white dark:bg-gray-400/10 rounded-lg border-none pt-4 mx-auto mt-20 text-slate-800 dark:text-slate-200'>
            <div className='absolute px-2 top-0 bg-white dark:bg-slate-800 rounded-tl-lg rounded-br-lg'>
               <h4 className='text-md font-semibold text-gray-800 dark:text-white'>Review</h4>
            </div>
            <div>
               {/* lazy load this component here too */}
               <ActiveRating
                  userId={props.params.userId}
                  ratingValue={props?.currentRatingValue}
                  shouldDisplay={true}
                  controlledRating={rating}
                  setRating={setRating}
                  displayTitle={false}
                  size='medium'
                  reset={resetFlag}
               />

               <CreateComment
                  bookData={props.bookData}
                  mutate={handleMutation}
                  placeholder='Write your Review'
                  isLoading={isLoading}
                  containerClassName='mt-3 md:mt-4 px-3 my-2'
                  className='h-32 p-2 lg:p-3'
               />
            </div>
         </div>
      </section>
   );
};

export default forwardRef(PostReviewSection);
