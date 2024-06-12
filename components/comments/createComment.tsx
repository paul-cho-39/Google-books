import { useState, FormEvent, Dispatch, SetStateAction } from 'react';

import { MAXIMUM_CONTENT_LENGTH } from '@/constants/inputs';
import { AddCommentBody, NewCommentBody } from '@/lib/types/models/books';
import { Items } from '@/lib/types/googleBookTypes';
import Spinner from '../loaders/spinner';
import DisplayWordCount from './wordCount';
import classNames from 'classnames';

type HandleMutate<CType extends NewCommentBody | AddCommentBody> = (body: CType) => void;

interface CreateCommentProps<CType extends NewCommentBody | AddCommentBody> {
   mutate: HandleMutate<CType>;
   isLoading: boolean;
   placeholder: string;
   bookData?: Items<Record<string, string>> | null;
   containerClassName?: string;
   className?: string;
}

/**
 * @Component
 * @description Component designd specifically for handling comments for replying to a comment or adding a new comment.
 * It handles all the response payload and submitting the data to the API. It still has to pass `mutate` and `bookData`.
 */
const CreateComment = <CType extends NewCommentBody | AddCommentBody>({
   mutate,
   bookData,
   placeholder,
   isLoading,
   containerClassName,
   className,
}: CreateCommentProps<CType>) => {
   const [comment, setComment] = useState('');

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (comment.length < 1 || comment.length > MAXIMUM_CONTENT_LENGTH) return;

      try {
         // when adding a new comment
         if (bookData && bookData !== null) {
            const { getBodyFromFilteredGoogleFields } = await import(
               '@/lib/helper/books/getBookBody'
            );
            const data = getBodyFromFilteredGoogleFields(bookData);
            const body = { data, comment: comment } as NewCommentBody;
            mutate(body as CType);
         } else {
            // the comments will be reply content only
            const body = { comment } as AddCommentBody;
            mutate(body as CType);
         }
      } catch (err) {
         console.error('Error trying to post a comment', err);
      } finally {
         setComment('');
      }
   };

   return (
      <div>
         <form onSubmit={handleSubmit}>
            <div className={classNames(containerClassName, 'container w-full ')}>
               <textarea
                  className={classNames(
                     className,
                     'bg-gray-100 dark:bg-gray-600 rounded border border-gray-400 w-full font-medium placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-1 focus:outline-black dark:focus:outline-slate-400 dark:focus:ring-gray-600'
                  )}
                  name='body'
                  placeholder={placeholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
               ></textarea>
            </div>
            <div className='w-full flex justify-end px-4 my-4'>
               <button
                  type='submit'
                  disabled={isLoading}
                  className='px-2.5 py-1.5 rounded-lg text-lg text-gray-800 dark:text-white bg-beige dark:bg-charcoal'
               >
                  {isLoading ? <Spinner size='sm' color='indigo' /> : 'Post'}
               </button>
            </div>
         </form>
         <DisplayWordCount comment={comment} />
      </div>
   );
};

export default CreateComment;
