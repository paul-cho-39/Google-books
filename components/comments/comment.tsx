import { Suspense, lazy, useEffect, useState, useTransition } from 'react';

import { CommentData, CommentPayload } from '@/lib/types/response';
import { UserAvatarProps } from '../icons/avatar';
import CommentContent, { CommentInfo, CommentName } from './commentContent';
import { getUserName } from '@/lib/helper/getUserId';
import CommentReplies from './commentReplies';
import CommentActionWrapper from './commentAction';
import {
   BaseIdParams,
   MutationCommentParams,
   MutationUpvoteParams,
} from '@/lib/types/models/books';
import useMutateUpvote from '@/lib/hooks/useMutateUpvote';
import useHandleComments from '@/lib/hooks/useHandleComments';
import { formatDate } from '@/lib/helper/books/formatBookDate';
import { Divider } from '../layout/dividers';
import ModalOpener from '../modal/openModal';
import { DeleteContent } from '../modal/deleteContent';
import Button from '../buttons/button';

export interface CommentProps<TParams extends BaseIdParams | MutationCommentParams>
   extends UserAvatarProps {
   // rating: number;
   comment: CommentData;
   currentUserName: string;
   params: TParams;
}

const Comment = ({
   comment,
   params,
   currentUserName,
   // rating,
   ...props
}: CommentProps<MutationCommentParams>) => {
   const { avatarUrl: currentUserAvatar, ...rest } = props;
   // user by comment NOT current user
   const userByComment = getUserName.byComment(comment);

   const [displayReply, setDiplayReply] = useState(false);
   const [isPending, startTransition] = useTransition();
   const [showDelete, setDelete] = useState({
      displayIcon: comment.userId === params.userId,
      displayModal: false,
   });

   const { mutate: upvote } = useMutateUpvote(params);
   const { updateComment, deleteComment } = useHandleComments(params);
   const { mutate: mutateDelete, isLoading: isDeleteLoading, status } = deleteComment;

   // if replies are to be shown by event-based the logic should be included here to display replies
   const showDisplayReply = () => {
      startTransition(() => {
         setDiplayReply(true);
      });
   };

   const handleUpvote = () => {
      upvote();
   };

   const handleDelete = () => {
      mutateDelete();
   };

   const handleModal = () => {
      // ensuring that modal cannot be closed while the state is loading
      if (!isDeleteLoading) {
         const newState = !showDelete.displayModal;
         setDelete({
            ...showDelete,
            displayModal: newState,
         });
      }
   };

   useEffect(() => {
      if (status === 'success' || status === 'error') {
         setDelete((prevState) => ({
            ...prevState,
            displayModal: false,
         }));
      }
   }, [status]);

   return (
      <>
         <div className='px-2 py-2 flex '>
            <div className='flex-1 sm:px-6 leading-relaxed dark:text-gray-300'>
               {/* display avatar and name */}
               <CommentName
                  name={userByComment.name}
                  avatarUrl={userByComment.userImage}
                  {...rest}
               />

               {/* stars and date */}
               <CommentInfo
                  className='mb-2 py-2'
                  rating={comment.rating}
                  dateAdded={formatDate(comment.dateAdded)}
               />

               {/* comment content */}
               <CommentContent content={comment.content} className='my-2 py-2' />

               {/* comment display and action button */}
               <CommentActionWrapper
                  upvoteCount={comment?.upvoteCount || 0}
                  replyCount={comment?._count?.replies || 0}
                  replyToComment={showDisplayReply}
                  upvote={handleUpvote}
                  showDelete={showDelete.displayIcon} // only user authenticated allowed to delete the comment
                  deleteComment={handleModal}
               />
            </div>
         </div>

         {/* replies to the current commentId */}
         {displayReply && (
            <div className='my-4'>
               <Divider />
               {/* show comments here and the ability to reply here */}
               <CommentReplies
                  params={params}
                  currentUserName={currentUserName}
                  replies={comment.replies}
                  {...props}
               />
            </div>
         )}

         {/* modal opens when deleting the book */}
         <ModalOpener
            isOpen={showDelete}
            setIsOpen={setDelete}
            DialogTitle='Delete Comment'
            isLoading={isDeleteLoading}
         >
            <DeleteContent
               disabled={isDeleteLoading} // disables cancel button when processing delete
               content={'Are you sure you want to delete the comment?'}
               toggleModal={handleModal}
               showModal={showDelete.displayModal}
            >
               {/* DELETE COMMENT BUTTON */}
               <Button
                  handleSubmit={handleDelete}
                  isLoading={isDeleteLoading}
                  name={'Delete'}
                  className='btn-alert inline-flex justify-center items-center mb-2 w-36'
               />
            </DeleteContent>
         </ModalOpener>
      </>
   );
};

export default Comment;
