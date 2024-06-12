// DeleteButton should be the children

import classNames from 'classnames';

type DeleteContentProps = {
   showModal: boolean;
   toggleModal: () => void;
   content: string;
   disabled?: boolean;
   buttonClassName?: string;
   children?: React.ReactNode;
};

export const DeleteContent = ({
   showModal,
   toggleModal,
   content,
   buttonClassName,
   disabled,
   children,
}: DeleteContentProps) => {
   return (
      <>
         {showModal && (
            <div>
               <p role='alert' className='mb-5 px-6'>
                  {content}
               </p>
               <div className='flex flex-row justify-evenly items-center'>
                  <button
                     disabled={disabled}
                     className={classNames(
                        'btn-secondary inline-flex justify-center items-center mb-2 w-36',
                        buttonClassName
                     )}
                     onClick={toggleModal}
                  >
                     Cancel
                  </button>
                  {children}
               </div>
            </div>
         )}
      </>
   );
};
