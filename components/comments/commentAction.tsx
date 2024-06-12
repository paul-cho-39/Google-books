import { Dispatch, SetStateAction } from 'react';
import useMutateReply from '@/lib/hooks/useMutateUpdateComment';
import useMutateUpvote from '@/lib/hooks/useMutateUpvote';
import {
   ChatBubbleBottomCenterIcon,
   HandThumbUpIcon,
   TrashIcon,
} from '@heroicons/react/24/outline';

type CommmentActionDisplayProps = {
   replyCount: number;
   upvoteCount: number;
};

// upvote && reply is a mutation call from useMutation
type CommmentActionProps = {
   showDelete: boolean;
   deleteComment: () => void;
   upvote: () => void;
   replyToComment: () => void;
};

type CommentWrapperProps = CommmentActionDisplayProps & CommmentActionProps;

const CommentActionWrapper = ({ replyCount, upvoteCount, ...props }: CommentWrapperProps) => {
   return (
      <div className='flex flex-col gap-y-1'>
         <CommentActionDisplay replyCount={replyCount} upvoteCount={upvoteCount} />
         <CommentAction {...props} />
      </div>
   );
};

const CommentActionDisplay = ({ replyCount, upvoteCount }: CommmentActionDisplayProps) => {
   return (
      <div className='flex flex-row gap-x-2 pl-1 text-opacity-80 dark:text-slate-300 text-black'>
         <span>{upvoteCount} likes</span>
         {/* only display when reply is more than 0 */}
         {replyCount > 0 && <span>{replyCount} comment</span>}
         <span></span>
      </div>
   );
};

const CommentAction = ({
   upvote,
   deleteComment,
   replyToComment,
   showDelete,
}: CommmentActionProps) => {
   return (
      <div className='flex flex-row gap-x-2 font-semibold text-opacity-80 dark:text-gray-400'>
         <button className='flex flex-row items-center px-1 gap-x-1' onClick={upvote}>
            <HandThumbUpIcon className='w-4 h-4' />
            <span>Like</span>
         </button>
         <button className='flex flex-row items-center px-1 gap-x-1' onClick={replyToComment}>
            <ChatBubbleBottomCenterIcon className='w-4 h-4' />
            <span>Comment</span>
         </button>
         {/* delete component if userId === comment.userId */}
         {showDelete && (
            <button
               className='flex flex-row items-center px-1 gap-x-1'
               onClick={deleteComment}
               aria-label='Delete comment'
            >
               <TrashIcon className='w-4 h-4' />
               <span>Delete</span>
            </button>
         )}
      </div>
   );
};

export default CommentActionWrapper;
