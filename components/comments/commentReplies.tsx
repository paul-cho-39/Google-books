import { Fragment, useRef, useState } from 'react';

import { CommentData, CommentPayload } from '@/lib/types/response';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import CommentContent, { CommentName } from './commentContent';
import { getUserName } from '@/lib/helper/getUserId';
import CreateComment from './createComment';
import { UseMutationResult } from '@tanstack/react-query';
import { AddCommentBody, MutationCommentParams } from '@/lib/types/models/books';
import useMutateComment, { CustomStateType } from '@/lib/hooks/useMutateComment';

interface ReplyProps extends UserAvatarProps {
   params: MutationCommentParams;
   currentUserName: string;
   replies: CommentData[] | undefined;
}

const AVATAR_REPLY_SIZE = 20;

/**
 *
 * @param {Object} ReplyProps
 * @param {string} ReplyProps.currentUserName - the current user to be displayed next to leaving the comment.
 * @returns JSX.Element
 */
const CommentReplies = ({ params, replies, currentUserName, ...props }: ReplyProps) => {
   const { avatarUrl: currentUserAvatar, ...rest } = props;

   const topCommentRef = useRef<HTMLDivElement>(null);

   const scrollToTopReview = () => {
      if (topCommentRef.current) {
         const elementRect = topCommentRef.current.getBoundingClientRect();
         const top = elementRect.top + window.scrollY;
         window.scrollTo({ top, behavior: 'smooth' });
      }
   };

   const { mutate, isLoading, isError } = useMutateComment(params, scrollToTopReview, 'review');

   const handleMutate = (body: AddCommentBody) => {
      mutate(body);
   };

   return (
      <div className='flex flex-col space-y-2 w-full px-4 lg:px-6 xl:px-8 mt-4'>
         {replies && replies.length > 0 && (
            <div className='flex-grow mr-3 space-y-4'>
               {/* mapping replies here */}
               {replies.map((reply) => (
                  <Reply key={reply.id} reply={reply} />
               ))}
            </div>
         )}
         {/* reply to comment here */}
         <div className='flex flex-col w-full'>
            {/* get the current user name */}
            <CommentName
               avatarUrl={currentUserAvatar}
               name={currentUserName}
               className='flex-shrink'
               size={{
                  height: AVATAR_REPLY_SIZE,
                  width: AVATAR_REPLY_SIZE,
               }}
            />
            <CreateComment
               placeholder='Add a comment'
               mutate={handleMutate}
               isLoading={isLoading}
               className='rounded-lg'
               containerClassName='px-2'
            />
         </div>
      </div>
   );
};

const Reply = ({ reply }: { reply: CommentData }) => {
   const repliedUser = getUserName.byComment(reply);
   return (
      <div className='flex flex-col px-1'>
         <CommentName
            name={repliedUser.name}
            avatarUrl={repliedUser.userImage}
            size={{
               height: AVATAR_REPLY_SIZE,
               width: AVATAR_REPLY_SIZE,
            }}
         />
         <CommentContent content={reply.content} className='mb-2 pb-1' />
      </div>
   );
};

export default CommentReplies;
