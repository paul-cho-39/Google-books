import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';

type ObjectType = { [key: string]: any; displayModal: boolean };

interface ModalProps<T extends boolean | ObjectType> {
   isOpen: T;
   setIsOpen: Dispatch<SetStateAction<T>>;
   DialogTitle: string;
   children: React.ReactNode;
   isLoading?: boolean;
}

/**
 * @Component
 * @description Opens the modal. Ensure that when using an object, 'displayModal' is defined, or else it will thrown an error.
 * @param param0
 * @returns
 */
const ModalOpener = <T extends boolean | ObjectType>({
   isOpen,
   setIsOpen,
   DialogTitle,
   children,
   isLoading = false,
}: ModalProps<T>) => {
   function validateModalState(state: boolean | { displayModal?: boolean }) {
      // throw error if the object key does not contain 'displayModal'
      if (typeof state === 'object' && !('displayModal' in state)) {
         throw new Error("The object passed as 'isOpen' must contain a 'displayModal' property");
      }
      return typeof state === 'boolean' ? state : state.displayModal;
   }

   function closeModal() {
      // if loading is passed then ensure modal does not close until loading is false
      if (!isLoading) {
         const newState =
            typeof isOpen === 'boolean'
               ? false
               : ({ ...isOpen, displayModal: false } as ObjectType);
         setIsOpen(newState as T);
      }
   }

   const shouldShow = validateModalState(isOpen);

   return (
      <Transition appear show={shouldShow} as={Fragment}>
         {/* maybe set z-highest z-higher z-high */}
         <Dialog as='div' className='relative z-50 dark:bg-slate-700' onClose={closeModal}>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='mx-auto flex min-h-full items-center justify-center p-4 text-center'>
                  <Transition.Child
                     as={Fragment}
                     enter='ease-out duration-150'
                     enterFrom='opacity-0 scale-95'
                     enterTo='opacity-100 scale-100'
                     leave='ease-in duration-200'
                     leaveFrom='opacity-100'
                     leaveTo='opacity-0'
                  >
                     <Dialog.Panel className='overflow-y-hidden w-full h-auto max-w-md transform rounded-2xl bg-white dark:bg-slate-500 p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title
                           as='h3'
                           className='mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'
                        >
                           {DialogTitle}
                        </Dialog.Title>
                        <div className='mt-2 dark:text-gray-300'>{children}</div>
                     </Dialog.Panel>
                  </Transition.Child>
               </div>
            </div>
         </Dialog>
      </Transition>
   );
};

export default ModalOpener;
