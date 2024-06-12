import { useCallback } from 'react';
import { getBodyFromFilteredGoogleFields } from '../helper/books/getBookBody';
import { Items } from '../types/googleBookTypes';
import { DataWithRatings, MutationBase, RatingsWithoutData } from '../types/models/books';
import { MultipleRatingData } from '../types/serverTypes';
import useMutateRatings from './useMutateRating';
import { useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';

function useHandleRating(
   params: MutationBase,
   data: Items<any>,
   currentAllRatingData: MultipleRatingData | null | undefined
) {
   const {
      mutation: { mutate: createMutation, isLoading: isCreateLoading, isError: isCreateError },
      currentRatingData,
   } = useMutateRatings<'create'>(params, 'create');

   const {
      mutation: { mutate: updateMutation, isLoading: isUpdateLoading, isError: isUpdateError },
   } = useMutateRatings<'update'>(params, 'update');

   const {
      mutation: { mutate: removeMutation, isLoading: isRemoveLoading, isError: isRemoveError },
   } = useMutateRatings<'remove'>(params, 'remove');

   const handleMutation = (rating: number, controlled: boolean) => {
      // create a book based on all ratings not user book rating
      // rating += 1;
      // if the rating is controlled from parent component it shouldnt increment
      rating = !controlled ? rating + 1 : rating;

      const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);

      // new rating data requires adding book data payload
      const createBody = { bookData, rating };
      const updateBody = { rating };

      notCreated ? createMutation(createBody) : updateMutation(updateBody);
   };

   // removes comments
   const handleRemoveMutation = () => {
      removeMutation(null);
   };

   return { handleMutation, handleRemoveMutation, currentRatingData };
}

type UseHandleRatingResult = ReturnType<typeof useHandleRating>;

export type { UseHandleRatingResult };
export default useHandleRating;
