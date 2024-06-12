import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import DeleteButton from './deleteButton';
import { userActionButtons } from '@/utils/userActionButton';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { DeleteContent } from '../modal/deleteContent';
import { LIBRARY_DURATION } from '@/constants/throttle';

// mobile version of adding the book to the library
const PopOverButtons = ({ userId, book }: UserActionButtonProps) => {
   const [isHidden, setIsHidden] = useState(false);
   const [isClosed] = useState(true);

   // just like modal it goes to another content
   // except it stays inside the popover and the content is displayed
   // when it is toggled
   const toggleHide = () => {
      setIsHidden((prev) => !prev);
   };

   const handleClick = () => {
      setIsHidden(false);
   };

   return (
      <Popover className='relative md:hidden'>
         {({ open, close }) => (
            <>
               <Popover.Button
                  onClick={handleClick}
                  className={`
                ${open ? 'ring-black ring-2' : 'text-opacity-90'}
                -top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
               >
                  <ChevronDownIcon
                     className='h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-slate-200'
                     aria-hidden='true'
                  />
               </Popover.Button>
               <Transition show={open}>
                  <Transition.Child
                     as={Fragment}
                     enter='transition origin-top ease-out duration-500'
                     enterFrom='opacity-0 translate-y-5'
                     enterTo='opacity-100 translate-y-0'
                     leave='transition ease-in duration-400'
                     leaveFrom='opacity-100 translate-y-0'
                     leaveTo='opactiy-0 translate-y-5 duration-250'
                  >
                     <Popover.Panel className='fixed left-0 w-full h-[16rem] bottom-[0%] z-50 border-t-2 bg-dilutedbeige dark:bg-slate-400'>
                        <div className='w-full'>
                           <div className='w-full flex flex-row'>
                              <h2 className='pl-12 text-xl flex-grow text-center p-2 font-medium dark:text-slate-200 text-slate-800'>
                                 Choose book shelf
                              </h2>
                              <button
                                 onClick={() => close()}
                                 className='inline-flex items-end justify-end px-5'
                              >
                                 <span className='sr-only'>Close Button Icon</span>
                                 <XMarkIcon
                                    title='Close'
                                    aria-hidden={true}
                                    className='mt-3 mb-5 w-6 h-6 hover:rounded-full hover:ring-2 hover:ring-black'
                                 />
                              </button>
                           </div>
                           <div
                              aria-hidden={isHidden}
                              className={`${
                                 isHidden ? 'hidden' : 'm-2 mb-4 flex flex-col divide-y-2'
                              }`}
                           >
                              <div className='flex flex-col justify-center items-center'>
                                 {userActionButtons.map((userActionButton) => (
                                    <div key={userActionButton.name}>
                                       {userActionButton.name === 'Delete' ? (
                                          // trigger opening the other content
                                          <userActionButton.Component
                                             toggleHide={toggleHide}
                                             userId={userId}
                                             className='w-56 rounded-xl'
                                             book={book}
                                          />
                                       ) : (
                                          // other action buttons
                                          <userActionButton.Component
                                             userId={userId}
                                             book={book}
                                             className='w-56 rounded-xl'
                                             close={() => {
                                                isClosed && close();
                                             }}
                                          />
                                       )}
                                    </div>
                                 ))}
                              </div>
                           </div>
                           {/* is hidden until clicking the delete button */}
                           <DeleteContent
                              content={
                                 'All data will be lost containing this book. Are you sure you want to delete the book?'
                              }
                              toggleModal={toggleHide}
                              showModal={isHidden}
                           >
                              <DeleteButton
                                 book={book}
                                 userId={userId}
                                 close={() => {
                                    isClosed &&
                                       setTimeout(() => {
                                          close();
                                       }, LIBRARY_DURATION);
                                 }}
                              />
                           </DeleteContent>
                        </div>
                     </Popover.Panel>
                  </Transition.Child>
               </Transition>
            </>
         )}
      </Popover>
   );
};

export default PopOverButtons;
