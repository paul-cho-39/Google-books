import { useEffect, useRef, useState } from 'react';
import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';

import { removeHtmlTags, sliceDescription } from '@/lib/helper/books/editBookPageHelper';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

// export type LineClamp =
//    | 'line-clamp-1'
//    | 'line-clamp-2'
//    | 'line-clamp-3'
//    | 'line-clamp-4'
//    | 'line-clamp-5'
//    | 'line-clamp-6';

type TextSize = 'text-xs' | 'text-sm' | 'text-md' | 'text-lg' | 'text-xl'; // add more if needed
const MAX_HEIGHT = 175;

// interface DescriptionProps extends LinkProps {
//    description: string | undefined;
//    descriptionLimit?: number;
//    isLink?: boolean;
//    lineClamp?: LineClamp;
//    textSize?: TextSize;
//    className?: string;
// }

// const BookDescription = ({
//    description,
//    descriptionLimit = 200,
//    isLink = false,
//    lineClamp = 'line-clamp-3',
//    textSize = 'text-sm',
//    className,
//    ...props
// }: DescriptionProps) => {
//    const [toggleDescription, setToggleDescription] = useState(false);

//    const filteredDescription = removeHtmlTags(description);
// const displayedDescription = sliceDescription(filteredDescription, descriptionLimit);
//    const minimumDescriptionChar = filteredDescription?.toString().length;

//    // if there isnt any description
//    const isDescriptionEmpty = !filteredDescription || !displayedDescription;

//    const SeeMoreElement = isLink ? (
//       // if it is a link there is no height
//       <Link {...props}>
//          <a
//             data-testid='visible-link'
//             aria-label='See more about this book'
//             className='flex items-center justify-end px-2 hover:translate-x-1 hover:text-slate-300 transition-all duration-200'
//          >
//             <span className='text-blue-500 text-xs'>See More</span>{' '}
//             <ArrowRightIcon color='rgb(59, 130, 246)' height='10' width='10' />{' '}
//          </a>
//       </Link>
//    ) : (
//       <button
//          aria-expanded={toggleDescription}
//          role='button'
//          onClick={() => setToggleDescription(true)}
//          className={`${
//             //
//             minimumDescriptionChar && minimumDescriptionChar < descriptionLimit
//                ? 'hidden'
//                : 'inline-flex font-semibold mt-2.5 transition-opacity dark:text-slate-200 duration-100 hover:opacity-50 hover:cursor-pointer'
//          }`}
//       >
//          <span>See More</span>
//          <ArrowDownIcon height='25' width='20' />{' '}
//       </button>
//    );

//    return (
//       <article>
//          {isDescriptionEmpty ? (
//             <NoDescription />
//          ) : (
//             <>
//                {/* if this component is not expanded */}
//                {!toggleDescription ? (
//                   <>
//                      <CollapsedDescription
//                         description={displayedDescription}
//                         descriptionLimit={descriptionLimit}
//                         lineClamp={lineClamp}
//                         isLink={isLink}
//                         className={className}
//                      />
//                      {SeeMoreElement}
//                   </>
//                ) : (
//                   // component displaying full description
//                   <ExpandedDescription description={filteredDescription.toString()} />
//                )}
//             </>
//          )}
//          <button
//             role='button'
//             aria-expanded={toggleDescription}
//             onClick={() => setToggleDescription(false)}
//             className={`${
//                !toggleDescription
//                   ? 'hidden'
//                   : 'flex font-semibold hover:cursor-pointer hover:opacity-50 dark:text-slate-200'
//             } py-2`}
//          >
//             <span>See Less</span> <ArrowUpIcon aria-hidden height='25' width='20' />
//          </button>
//       </article>
//    );
// };

// const CollapsedDescription = ({
//    description,
//    descriptionLimit,
//    isLink,
//    lineClamp,
//    className,
// }: {
//    description: string;
//    isLink?: boolean;
//    descriptionLimit?: number;
//    className?: string;
//    lineClamp?: LineClamp;
//    // textSize?: TextSize;
// }) => (
//    <div className={classNames(isLink ? 'mb-0' : 'mb-5', 'relative')}>
//       <p
//          aria-live='polite'
//          aria-label='Collapsed book description'
//          className={clsx(`${lineClamp} dark:text-slate-100 `, className)}
//       >
//          {descriptionLimit ? description.slice(0, descriptionLimit) + '...' : description}
//       </p>
//       <div
//          className={classNames(
//             isLink
//                ? 'hidden'
//                : 'absolute h-14 w-full top-7 bg-gradient-to-b from-slate-100/5 to-[#ffffff] dark:from-slate-800/50 dark:to-slate-800 dark:opacity-90'
//          )}
//       ></div>
//    </div>
// );

// const ExpandedDescription = ({
//    description,
//    textSize,
// }: {
//    description: string;
//    textSize?: TextSize;
// }) => (
//    <p
//       aria-live='polite'
//       className={classNames(`${textSize}, dark:text-slate-100 leading-relaxed`)}
//       aria-label='Expanded book description'
//    >
//       {description}
//    </p>
// );

interface DescriptionProps extends LinkProps {
   description: string | undefined;
   descriptionLimit?: number;
   textSize?: TextSize;
   isLink?: boolean;
   className?: string;
}

type ButtonStateType = 'link' | 'toggle' | 'none';
type DescriptionStateType = 'expanded' | 'collapsed' | 'link' | 'none';

const BookDescription = ({
   description,
   descriptionLimit = 200,
   textSize,
   isLink = false,
   className,
   ...props
}: DescriptionProps) => {
   const filteredDescription = removeHtmlTags(description);
   const htmlDesc = { __html: description as string };
   const linkDesc = sliceDescription(filteredDescription, descriptionLimit);

   const descriptionRef = useRef<HTMLDivElement>(null);
   const [descType, setDescType] = useState<DescriptionStateType>(
      !description ? 'none' : !isLink ? 'collapsed' : 'link'
   );
   const [buttonType, setButtonType] = useState<ButtonStateType>(isLink ? 'link' : 'none');
   const canToggle = buttonType === 'toggle';

   useEffect(() => {
      const currentState = isLink ? 'link' : 'none';

      // if `isLink` is passed as a prop there should not be any link
      if (
         (!isLink && descriptionRef.current && descriptionRef.current.clientHeight > MAX_HEIGHT) ||
         (!descriptionRef.current && descType === 'expanded') // if it is expanded then still display toggle
      ) {
         setButtonType('toggle');
      } else {
         setButtonType(currentState);
      }
   }, [descType, filteredDescription, isLink]);

   const toggleDescription = () => {
      // set expanded here
      if (descType === 'collapsed') {
         setDescType('expanded');
      } else if (descType === 'expanded') {
         setDescType('collapsed');
      }
   };

   const buttonMapper = {
      link: () => (
         <Link {...props}>
            <div className='flex items-center justify-end px-2'>
               <a className='flex flex-row items-center hover:underline-offset-1 hover:underline hover:dark:decoration-gray-200 hover:decoration-black hover:cursor-pointer dark:text-slate-200'>
                  <span className='text-blue-500 text-xs'>See More</span>
                  <ArrowRightIcon color='rgb(59, 130, 246)' height='10' width='10' />
               </a>
            </div>
         </Link>
      ),
      // set this in the middle?
      toggle: (type: 'collapse' | 'expand') =>
         canToggle && (
            <button
               onClick={toggleDescription}
               className='mt-2 flex items-center font-semibold hover:underline-offset-1 hover:underline hover:dark:decoration-gray-200 hover:decoration-black hover:cursor-pointer dark:text-slate-200'
            >
               <span>
                  <b>{type === 'collapse' ? 'See More' : 'See Less'}</b>
               </span>
               {type === 'collapse' ? (
                  <ArrowDownIcon height='25' width='20' />
               ) : (
                  <ArrowUpIcon height='25' width='20' />
               )}
            </button>
         ),
      none: () => null,
   };

   const descriptionMapper = {
      expanded: () => (
         // fully expanded version
         <div className='dark:text-slate-100' id='expanded-desc' aria-expanded>
            <p className={classNames(textSize, 'dark:text-slate-100')}>{filteredDescription}</p>
            {/* <div
               className={classNames(textSize, 'dark:text-slate-100')}
               dangerouslySetInnerHTML={htmlDesc}
            ></div> */}
            {buttonMapper['toggle']('expand')}
         </div>
      ),
      // the default is 'collapsed'
      collapsed: () => (
         <div
            ref={descriptionRef}
            id='collapsed-desc'
            // dangerouslySetInnerHTML={htmlDesc}
            className={classNames('relative max-h-48 py-2 dark:text-slate-100', className)}
         >
            <p className={classNames(textSize, 'max-h-[10rem] overflow-hidden')}>
               {filteredDescription}
            </p>
            {canToggle && (
               <div className='py-1'>
                  <div className='absolute top-[9rem] h-14 w-full bg-gradient-to-b from-slate-100/5 to-[#ffffff] dark:from-slate-800/50 dark:to-slate-800'></div>
                  <div className='absolute z-30 left-0 top-[11rem] w-full flex flex-row items-center justify-center'>
                     {buttonMapper['toggle']('collapse')}
                  </div>
               </div>
            )}
         </div>
      ),
      link: () => (
         <div>
            <p className={classNames(textSize, 'dark:text-slate-100')}>
               {descriptionLimit ? linkDesc?.slice(0, descriptionLimit) + '...' : linkDesc}
            </p>
            {buttonMapper['link']()}
         </div>
      ),
      // provide one for link here
      none: () => <NoDescription />,
   };

   return <article>{descriptionMapper[descType]()}</article>;
};

const NoDescription = () => (
   <p aria-live='assertive' className='dark:text-slate-100'>
      No description provided
   </p>
);

export default BookDescription;
