import { useEffect, useRef, useState } from 'react';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import DisplayRating from '../bookcover/ratings';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { CommentPayload } from '@/lib/types/response';
import classNames from 'classnames';

type CommentContentProps = {
   content: string;
   className?: string;
};

const MAX_HEIGHT = 145;
const TEXT_BASE = 1;

// if the description is too long then display show more
const CommentContent = ({ content, className }: CommentContentProps) => {
   const commentRef = useRef<HTMLDivElement>(null);
   const [isExpand, setExpand] = useState(false);
   const [showMore, setShowMore] = useState(false);

   useEffect(() => {
      if (!commentRef.current) return;

      if (commentRef.current?.clientHeight > MAX_HEIGHT) {
         setShowMore(true);
      }
   }, []);

   return (
      <div className={classNames(className, 'py-2 relative')}>
         {showMore && isExpand ? (
            <div aria-expanded={showMore && isExpand}>
               <p>{content}</p>
            </div>
         ) : (
            // if it does not exceed the maximum height
            <div ref={commentRef} className='relative max-h-44'>
               <p className='max-h-[8.8rem] text-base overflow-hidden '>{content}</p>
               {showMore && (
                  <div className='mt-1 mb-2 py-1' aria-expanded={isExpand}>
                     <div className='absolute top-[6.8rem] h-14 w-full bg-gradient-to-b from-slate-100/5 to-[#ffffff] dark:from-slate-800/50 dark:to-slate-800'></div>

                     <div className='absolute z-30 left-0 top-[9rem] w-full flex flex-row items-center'>
                        <button
                           className='hover:underline hover:underline-offset-1 hover:dark:decoration-gray-200 hover:decoration-black'
                           onClick={() => setExpand(true)}
                        >
                           Show more
                        </button>
                        <ArrowRightIcon className='w-4 h-4 text-gray-800 dark:text-slate-300' />{' '}
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
      // </div>
   );
};

export default CommentContent;

// set a destinated height for each of the comment.
// When 'show more' expand the height so that it will fully cover the entire char length

interface CommentNameProps extends UserAvatarProps {
   name: string;
   className?: string;
}

export const CommentName = ({ name, className, ...props }: CommentNameProps) => {
   return (
      <div className={classNames(className, 'w-full flex flex-row py-1 justify-start items-start')}>
         <UserAvatar {...props} />
         <h3 className='px-3'>
            <strong>{name}</strong> {/* display rating here */}
         </h3>
      </div>
   );
};

interface CommentInfoProps<T extends string | Date> {
   dateAdded: T;
   rating?: number;
   className?: string;
}

export const CommentInfo = ({ dateAdded, rating, className }: CommentInfoProps<string>) => {
   return (
      <div className={classNames(className, 'w-full flex justify-between')}>
         {rating && <DisplayRating averageRating={rating} size='medium' displayText={false} />}
         <span className='text-xs text-gray-400 '>{dateAdded}</span>
      </div>
   );
};
