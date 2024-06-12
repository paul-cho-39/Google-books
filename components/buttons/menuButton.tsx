import { Fragment, useState } from 'react';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { userActionButtons } from '@/utils/userActionButton';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import DeleteButton from './deleteButton';
import ModalOpener from '../modal/openModal';
import { DeleteContent } from '../modal/deleteContent';

const MenuButtons = ({ userId, book }: UserActionButtonProps) => {
   const [openDeleteModal, setOpenModal] = useState(false);

   const handleModal = (closeMenu: () => void) => {
      closeMenu();
      setOpenModal(true);
   };

   return (
      <div className='hidden md:flex md:relative lg:relative'>
         <Menu as='div'>
            {/* close is passed as props and when clicked it will close the menu */}
            {({ open, close }) => (
               <>
                  <Menu.Button
                     className={classNames(
                        '-top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
                     )}
                  >
                     <ChevronDownIcon
                        className='h-5 w-5 text-black hover:text-violet-100 dark:text-slate-200'
                        aria-hidden='true'
                     />
                  </Menu.Button>
                  <Transition
                     as={Fragment}
                     enter='transition ease-out duration-100'
                     enterFrom='transform opacity-0 scale-95'
                     enterTo='transform opacity-100 scale-100'
                     leave='transition ease-in duration-75'
                     leaveFrom='transform opacity-100 scale-100'
                     leaveTo='transform opacity-0 scale-95'
                  >
                     <Menu.Items className='dark:bg-slate-500 bg-slate-100 absolute z-10 right-0 -mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-3xl shadow-lg ring-1 ring-black/5 focus:outline-none'>
                        <div className='px-2 py-2 divide-y-2'>
                           {userActionButtons.map((userActionButton) => (
                              <Menu.Item key={userActionButton.name}>
                                 {({ active }) => (
                                    <>
                                       {userActionButton.name === 'Delete' ? (
                                          <userActionButton.Component
                                             userId={userId}
                                             book={book}
                                             toggleHide={() => handleModal(close)}
                                             className={classNames(
                                                active ? 'bg-slate-200' : 'bg-none',
                                                'px-2 py-2 w-48 border-none'
                                             )}
                                          />
                                       ) : (
                                          <userActionButton.Component
                                             userId={userId}
                                             book={book}
                                             close={() => close()}
                                             className={classNames(
                                                active ? 'bg-slate-200' : 'bg-none',
                                                'px-2 py-2 w-48 border-none'
                                             )}
                                          />
                                       )}
                                    </>
                                 )}
                              </Menu.Item>
                           ))}
                        </div>
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>

         {/* modal for deleting the book content */}
         <ModalOpener
            isOpen={openDeleteModal}
            setIsOpen={setOpenModal}
            DialogTitle='Delete book from library'
         >
            {/* name is a bit confusing but isHidden = isShow */}
            <DeleteContent
               content={
                  'All data will be lost containing this book. Are you sure you want to delete the book?'
               }
               toggleModal={() => setOpenModal(false)}
               showModal={openDeleteModal}
               buttonClassName='w-32 inline-flex items-center justify-center'
            >
               <DeleteButton
                  book={book}
                  userId={userId}
                  closeModal={setOpenModal}
                  className='w-32'
               />
            </DeleteContent>
         </ModalOpener>
      </div>
   );
};

export default MenuButtons;
