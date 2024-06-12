import { UrlProps, ServerCacheType, ServerSearchParamType } from '@/lib/types/fetchbody';

const BASE_PATH = '/api';
const DOMAIN_BOOKS = 'books';
const DOMAIN_COMMENT = 'comments';
const DOMAIN_THIRD_PARTY = 'third-party';
const DOMAIN_USER = 'user';
const DOMAIN_USER_SETTINGS = 'user-settings';
const DOMAIN_VERIFY = 'verify';
const DOMAIN_RATING = 'rating';

const API_ROUTES = {
   AUTH: {
      SIGNOUT: `${BASE_PATH}/auth/credentials-signout`,
   },
   BOOKS: {
      path: (userId: string, subdomain: UrlProps) =>
         subdomain === 'main'
            ? `${BASE_PATH}/${DOMAIN_BOOKS}/${userId}`
            : `${BASE_PATH}/${DOMAIN_BOOKS}/${userId}/${subdomain}`,
   },
   COMMENTS: {
      ADD: (userId: string, bookId: string) => `${BASE_PATH}/${DOMAIN_COMMENT}/${userId}/${bookId}`,
      GET_COMMENTS: (bookId: string, page: string) =>
         `${BASE_PATH}/${DOMAIN_COMMENT}/${bookId}/${page}/retrieve`,
      REPLY: (userId: string, bookId: string, idx: string) =>
         `${BASE_PATH}/${DOMAIN_COMMENT}/${userId}/${bookId}/${idx}`,
      DELETE: (userId: string, bookId: string, idx: string) =>
         `${BASE_PATH}/${DOMAIN_COMMENT}/${userId}/${bookId}/${idx}`,
      UPVOTE: (userId: string, bookId: string, idx: string) =>
         `${BASE_PATH}/${DOMAIN_COMMENT}/${userId}/${bookId}/${idx}/upvote`,
      UPDATE_COMMENT: (id: string, userId: string) =>
         `${BASE_PATH}/${DOMAIN_COMMENT}/${id}/${userId}/update`,
   },
   THIRD_PARTY: {
      path: (pathTypes: ServerCacheType) => {
         const { source, endpoint, category } = pathTypes;
         return `${BASE_PATH}/${DOMAIN_THIRD_PARTY}/${source}/${category}/${endpoint}`;
      },
      search: (pathTypes: ServerSearchParamType) => {
         const { endpoint, query, filters } = pathTypes;
         const base = `${BASE_PATH}/${DOMAIN_THIRD_PARTY}/google/${query}/${filters}`;
         return !endpoint ? base : `${base}/${endpoint}`;
      },
      book: (id: string) => {
         return `${BASE_PATH}/${DOMAIN_THIRD_PARTY}/google/${id}`;
      },
   },
   USERS: {
      AUTHENTICATE: `${BASE_PATH}/${DOMAIN_USER}/authenticate-credential`,
      DELETE: `${BASE_PATH}/${DOMAIN_USER}/delete-account`,
      SIGNUP: `${BASE_PATH}/${DOMAIN_USER}/signup`,
   },

   SETTING: {
      CHANGE_PASSWORD: `${BASE_PATH}/${DOMAIN_USER_SETTINGS}/change-password`,
      CHANGE_NAME: `${BASE_PATH}/${DOMAIN_USER_SETTINGS}/names`,
   },
   VERIFY: {
      RESET_EMAIL: (userId: string, token: string) =>
         `${BASE_PATH}/${DOMAIN_VERIFY}/${userId}/${token}`,
      SEND_VERIFICATION: `${BASE_PATH}/${DOMAIN_VERIFY}`,
   },
   RATING: {
      BATCH: `${BASE_PATH}/${DOMAIN_RATING}/batch-categories`,
      RATE_BOOK: {
         UPDATE: (userId: string, id: string) =>
            `${BASE_PATH}/${DOMAIN_RATING}/${userId}/${id}/update`,
         CREATE: (userId: string, id: string) => `${BASE_PATH}/${DOMAIN_RATING}/${userId}/${id}`,
      },
      // RATE_BOOK: (userId: string, id: string) => `${BASE_PATH}/${DOMAIN_RATING}/${userId}/${id}`,
   },
};

export default API_ROUTES;
