import { useCallback } from 'react';
import { getBodyFromFilteredGoogleFields } from '../helper/books/getBookBody';
import { Items } from '../types/googleBookTypes';
import { DataWithRatings, MutationBase, RatingsWithoutData } from '../types/models/books';
import { MultipleRatingData } from '../types/serverTypes';
import useMutateRatings from './useMutateRating';

function useHandleRating(
   params: MutationBase,
   data: Items<any>,
   currentAllRatingData: MultipleRatingData | null | undefined
) {
   const {
      mutation: { mutate: createMutation },
      currentRatingData,
   } = useMutateRatings<'create'>(params, 'create');

   const {
      mutation: { mutate: updateMutation },
   } = useMutateRatings<'update'>(params, 'update');

   const {
      mutation: { mutate: removeMutation },
   } = useMutateRatings<'remove'>(params, 'remove');

   // whenever current data or all rating data changes it should update the function
   // const handleMutation = useCallback(
   //    (rating: number) => {
   //       // create a book based on all ratings not user book rating
   //       rating += 1;
   //       const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
   //       const bookData = getBodyFromFilteredGoogleFields(data);
   //       const createBody = { bookData, rating };
   //       const updateBody = { rating };

   //       notCreated ? createMutation(createBody) : updateMutation(updateBody);
   //    },
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   //    [currentAllRatingData, currentRatingData]
   // );

   const handleMutation = (rating: number) => {
      // create a book based on all ratings not user book rating
      rating += 1;
      const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);
      const createBody = { bookData, rating };
      const updateBody = { rating };

      notCreated ? createMutation(createBody) : updateMutation(updateBody);
   };

   // use it without callback and see
   const handleRemoveMutation = useCallback(() => {
      removeMutation(null);
   }, [removeMutation]);

   return { handleMutation, handleRemoveMutation, currentRatingData };
}

export default useHandleRating;
