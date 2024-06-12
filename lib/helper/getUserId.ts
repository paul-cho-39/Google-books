import { Session } from 'next-auth';
import { UserInfo } from '../types/providers';
import { CommentData, CommentPayload } from '../types/response';

/**
 * Helper function to return user info from nested object. The object differs from credential and OAuth
 * @param user
 * @returns {Object} UserInfo
 */
export default function getUserInfo(user: Session | null): UserInfo {
   const userInSession = !!user;
   const userId = user && getUserKey(user as object, 'id');
   const isCredential = user && !user.isCredential ? false : true;
   const name = getUserName.bySession(user);
   const photoUrl = user?.user?.image;

   const userInfo = {
      userId,
      userInSession,
      name,
      isCredential,
      photoUrl,
   };

   return userInfo;
}

/**
 * @description Retrieves user state in a nested object
 * @param userObject
 * @param keyToFind
 * @returns
 */
export function getUserKey<T extends object>(userObject: T, keyToFind: string): string {
   const user =
      userObject &&
      Object.entries(userObject).reduce(
         (acc, [key, value]) =>
            key === keyToFind
               ? acc.concat(value)
               : typeof value === 'object'
               ? acc.concat(getUserKey(value, keyToFind) as unknown as [])
               : acc,
         []
      );
   return getUser(user);
}

function getUser(user: string[]) {
   return user && user[0]?.toString();
}

export const getUserName = {
   bySession: (user: Session | null) => {
      if (!user) return null;

      const name = getUserKey(user as object, 'name');

      if (!name) {
         return getUserKey(user as object, 'username');
      }

      return name;
   },
   // for credential provider username is always defined
   // for OAuth the name is defined as well and always be returning a string
   byComment: (comment: CommentData): { name: string; userImage: string | null } => {
      const name = comment.user.name;
      const username = comment.user.username;

      const userImage = comment.user.image;

      return {
         name: (!name ? username : name) as string,
         userImage,
      };
   },
};
