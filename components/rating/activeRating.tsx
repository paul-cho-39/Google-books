import { NextRouter, useRouter } from 'next/router';
import { Dispatch, useState, SetStateAction, useEffect } from 'react';
import Star, { Size } from '../icons/starIcon';
import DeleteRatingButton, { DeleteRatingButtonProps } from '../buttons/deleteRatingButton';
import { UseHandleRatingResult } from '@/lib/hooks/useHandleRating';
import { authenticateUser } from '@/lib/helper/authenticateUser';

export type ActiveRatingProps = {
   userId: string | null;
   // ratingData: SingleRatingData | undefined;
   ratingValue: number | undefined;
   handleResult?: UseHandleRatingResult;
   controlledRating?: number | null;
   setRating?: Dispatch<SetStateAction<number | null>>;
   title?: string;
   displayTitle?: boolean;
   reset?: boolean;
   size?: Size;
} & Omit<DeleteRatingButtonProps, 'handleRemoveMutation'>;

/**
 * @Component
 * @description Renders star rating supporting both controlled and uncontrolled state. The controlled state is when `rating` value is passed
 * as props and also set `setRating` value here as well.
 * @Object {ActiveRatingProps}
 * @returns
 */
const ActiveRating = ({
   userId,
   ratingValue,
   shouldDisplay,
   handleResult,
   controlledRating,
   setRating,
   title,
   reset,
   displayTitle = true,
   size = 'large',
}: ActiveRatingProps) => {
   const [hoveredStar, setHoveredStar] = useState<number | null>(null);

   const ratingTitle = !ratingValue ? 'Rate this book' : 'Rating saved';
   const [selectedRating, setSelectedRating] = useState<null | number>(ratingValue || 0);
   const router = useRouter();

   useEffect(() => {
      // sync controlledRating and as the source of truth. Otherwise, fall back to ratingValue
      const newRating = controlledRating !== null ? controlledRating : ratingValue;
      if (newRating && newRating > 0) {
         setSelectedRating(newRating);
      }
   }, [controlledRating, ratingValue]);

   useEffect(() => {
      if (reset) {
         setSelectedRating(null);
      }
   }, [reset]);

   // for rating sent to the api it has to increment by 1
   // if using it for reusability, pass a prop or alter this function
   const adjustRating = (num: number) => {
      return num + 1;
   };

   const handleMouseEnter = (index: number) => {
      setHoveredStar(adjustRating(index));
   };

   const handleMouseLeave = () => {
      setHoveredStar(null);
   };

   //   may have to change this logic here
   const handleClick = (rating: number) => {
      // authenticate user has signed in before
      authenticateUser(router, userId);
      const adjustedRating = adjustRating(rating);

      if (setRating) {
         setRating(adjustedRating);
      } else {
         setSelectedRating(adjustedRating);
      }

      // only save the result if there is a callback passed
      handleResult?.handleMutation(rating, false);
   };

   const getFillPercentage = (index: number) => {
      // first evaluate hovered state
      if (hoveredStar !== null) {
         return adjustRating(index) <= hoveredStar ? 100 : 0;
      } else if (selectedRating !== null) {
         // should not display means rating has been removed
         if (!shouldDisplay) return 0;
         else return adjustRating(index) <= selectedRating ? 100 : 0;
      }
      return 0;
   };

   return (
      <div className='flex flex-col items-center'>
         <div className='flex flex-row cursor-pointer'>
            {/* rating the book here */}
            {Array.from({ length: 5 }).map((_, index) => (
               <div
                  key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
               >
                  <Star fillPercentage={getFillPercentage(index)} size={size} />
               </div>
            ))}
         </div>
         {displayTitle && (
            <div className='lg:text-lg flex items-center space-x-2'>
               <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>
                  {title || ratingTitle}
               </h3>
               {/* if there is rating data */}
               {shouldDisplay && handleResult && (
                  <DeleteRatingButton
                     shouldDisplay={shouldDisplay}
                     handleRemoveMutation={handleResult.handleRemoveMutation}
                  />
               )}
            </div>
         )}
      </div>
   );
};

export default ActiveRating;

// export type ActiveRatingProps = {
//    params: MutationBase;
//    data: Items<any>;
//    allRatingData: MultipleRatingData | null | undefined;
//    size?: Size;
//    // router: NextRouter;
// } & Omit<DeleteRatingButtonProps, 'handleRemoveMutation'>;

// const ActiveRating = ({
//    params,
//    shouldDisplay,
//    data,
//    allRatingData,
//    size = 'large',
// }: ActiveRatingProps) => {
//    const userRatingData = params.prevRatingData;
//    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
//    const [isReady, setIsReady] = useState(false);

//    const ratingTitle = !userRatingData ? 'Rate this book' : 'Rating saved';
//    const [selectedRating, setSelectedRating] = useState<null | number>(
//       userRatingData?.ratingInfo?.ratingValue || 0
//    );

//    const router = useRouter();
//    const { handleMutation, handleRemoveMutation, currentRatingData } = useHandleRating(
//       {
//          ...params,
//          prevRatingData: userRatingData,
//       },
//       data,
//       allRatingData
//    );

//    const adjustRating = (num: number) => {
//       return num + 1;
//    };

//    const handleMouseEnter = (index: number) => {
//       setHoveredStar(adjustRating(index));
//    };

//    const handleMouseLeave = () => {
//       setHoveredStar(null);
//    };

//    //   may have to change this logic here
//    const handleClick = async (rating: number) => {

//       if (isReady && !params.userId) {
//          router.push(ROUTES.AUTH.SIGNIN_NEXT(router.asPath));
//       } else {
//          const adjustedRating = adjustRating(rating);
//          setSelectedRating(adjustedRating);

//          handleMutation(rating);
//       }
//    };

//    const getFillPercentage = (index: number) => {
//       // first evaluate hovered state
//       if (hoveredStar !== null) {
//          return adjustRating(index) <= hoveredStar ? 100 : 0;
//       } else if (selectedRating !== null) {
//          // should not display means rating has been removed
//          if (!shouldDisplay) return 0;
//          else return adjustRating(index) <= selectedRating ? 100 : 0;
//       }
//       return 0;
//    };

//    useEffect(() => {
//       if (!router.isReady) return;

//       setIsReady(true);
//    }, [router]);

//    return (
//       <div className='flex flex-col items-center'>
//          <div className='flex flex-row cursor-pointer'>
//             {/* rating the book here */}
//             {Array.from({ length: 5 }).map((_, index) => (
//                <div
//                   key={index}
//                   onMouseEnter={() => handleMouseEnter(index)}
//                   onMouseLeave={handleMouseLeave}
//                   onClick={() => handleClick(index)}
//                >
//                   <Star fillPercentage={getFillPercentage(index)} size={size} />
//                </div>
//             ))}
//          </div>
//          <div role='' className='lg:text-lg flex items-center space-x-2'>
//             <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>{ratingTitle}</h3>
//             {shouldDisplay && (
//                <DeleteRatingButton
//                   shouldDisplay={shouldDisplay}
//                   handleRemoveMutation={handleRemoveMutation}
//                />
//             )}
//          </div>
//       </div>
//    );
// };
