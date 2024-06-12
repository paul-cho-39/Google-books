import React, { Dispatch, SetStateAction } from 'react';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';
import Button from './UserActionBaseButton';

interface DeleteButtonProps extends UserActionButtonProps {
   closeModal?: Dispatch<SetStateAction<boolean>>; // only for medium size screen or larger
}

/**
 * @Component
 * @description This component is specific to deleting a book from user's library.
 * @param param0
 * @returns
 */
const DeleteButton = ({ userId, book, close, closeModal }: DeleteButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = { id, userId };

   const {
      mutation: { mutateAsync, mutate, isLoading, isSuccess, isError },
   } = useMutateLibrary<'delete'>({
      bookId: id,
      userId: userId,
      type: 'delete',
   });

   const handleClick = async () => {
      await mutateAsync(body).then(() => {
         // only close after it has stopped loading
         // would this be a problem?
         if (closeModal && !isLoading) {
            closeModal(false);
         }
         if (close) {
            close();
         }
      });
   };

   return (
      <Button
         isDisplayed={true}
         onClick={handleClick}
         isLoading={isLoading}
         isDeleteButton={true}
         className='mb-2 w-36'
         name={'Delete Book'}
      />
   );
};

export default DeleteButton;
