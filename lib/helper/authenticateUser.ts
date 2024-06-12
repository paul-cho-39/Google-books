import { NextRouter } from 'next/router';
import ROUTES from '@/utils/routes';

// helper function for authenticating user before
// if user is not authenticated, it routes to /signin page
export function authenticateUser(router: NextRouter, userId: string | null) {
   if (!userId) {
      router.push(ROUTES.AUTH.SIGNIN_NEXT(router.asPath));
   }
}
