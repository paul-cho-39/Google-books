export default function getUserId<T extends object>(userObject: T, keyToFind: string): string {
   const user =
      userObject &&
      Object.entries(userObject).reduce(
         (acc, [key, value]) =>
            key === keyToFind
               ? acc.concat(value)
               : typeof value === 'object'
               ? acc.concat(getUserId(value, keyToFind) as unknown as [])
               : acc,
         []
      );
   return getUser(user);
}

function getUser(user: string[]) {
   return user && user[0]?.toString();
}

export const getUserIdAvoidTs = (userInfo: any) => {
   const { user } = userInfo;
   return user;
};
