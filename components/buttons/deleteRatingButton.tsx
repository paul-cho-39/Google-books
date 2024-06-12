import React from 'react';
import { SingleRatingData } from '@/lib/types/serverTypes';
import useMutateRatings from '@/lib/hooks/useMutateRating';
import { PencilIcon } from '@heroicons/react/20/solid';

export type DeleteRatingButtonProps = {
   handleRemoveMutation: () => void;
   shouldDisplay: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

function DeleteRatingButton({ handleRemoveMutation, ...buttonProps }: DeleteRatingButtonProps) {
   return (
      <>
         <button
            {...buttonProps}
            onClick={handleRemoveMutation}
            aria-label='delete rating'
            className='lg:my-2 flex flex-row justify-center bg-transparent font-medium text-lg text-slate-800 dark:text-slate-200 hover:underline focus:outline-none'
         >
            <PencilIcon
               aria-hidden
               className='h-4 w-4 text-slate-800 dark:text-slate-200 lg:h-6 lg:w-6 lg:px-1'
            />
            <span className=''>Delete Rating</span>
         </button>
      </>
   );
}

export default DeleteRatingButton;
