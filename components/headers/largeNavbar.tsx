import Link from 'next/link';
import { ThemeToggler } from '../buttons/themeToggler';
import IsSession from '../Login/isSession';
import { NavigationProps } from '../../lib/types/theme';

export const LargeNavigation = ({
   user,
   userId,
   icons,
   darkTheme,
   url,
   signOut,
}: NavigationProps) => {
   return (
      <>
         <div className='flex items-center w-full px-8'>
            {/* Home Link */}
            <div className='mr-auto'>
               <Link href='/'>
                  <span className='text-xl font-bold text-slate-800 dark:text-slate-100'>Logo</span>
               </Link>
            </div>

            {/* Menu Items */}
            <nav className='h-full flex justify-center items-center space-x-1'>
               {Object.values(icons).map((icon) => (
                  <div
                     key={icon.name}
                     className='h-full w-full inline-flex items-center justify-center px-5 hover:ring-1 hover:bg-orange-200 focus:ring-1 focus-visible:ring-orange-200 focus-visible:ring-opacity-75 dark:hover:bg-slate-100/10 dark:focus-visible:ring-bg-slate-100/10'
                  >
                     <Link
                        href={icon.name === 'Home' ? icon.href : url + icon.href}
                        className='text-lg text-slate-800 dark:text-slate-100'
                     >
                        <span className='text-lg text-slate-800 dark:text-slate-100'>
                           {icon.name}
                        </span>
                     </Link>
                  </div>
               ))}
            </nav>

            <div className='flex items-center ml-auto space-x-6'>
               {!user ? (
                  <IsSession
                     name='Sign in'
                     href='/auth/signin'
                     className='text-lg text-dark-brown dark:text-soft-white'
                  />
               ) : (
                  <IsSession
                     name='Sign out'
                     signOut={signOut}
                     className='text-lg text-dark-brown dark:text-soft-white'
                  />
               )}
               <ThemeToggler
                  className='h-10 w-10'
                  theme={darkTheme.theme}
                  setTheme={darkTheme.setTheme}
               />
            </div>
         </div>
      </>
   );
};
