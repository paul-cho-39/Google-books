// layout page for /books/[slug]/

import APIErrorBoundary from '@/components/error/errorBoundary';
import NextHead from '@/components/headers/header';
import Spinner from '@/components/loaders/spinner';
import metaHeaders from '@/constants/headers';
import { LayoutBase } from '@/lib/types/theme';
import LoadingPage from '../loadingPage';

interface PageLayoutProps extends LayoutBase {
   title: string;
}

const PageLayout = ({ title, isLoading, children }: PageLayoutProps) => {
   const headProps = {
      title: metaHeaders.books.title(title),
      metaTags: metaHeaders.books.meta(title),
   };
   if (isLoading) {
      return <LoadingPage title={headProps.title} metaTags={headProps.metaTags} />;
   }

   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto px-1 lg:px-6 dark:bg-slate-800'>
         <NextHead title={headProps.title} metaTags={headProps.metaTags} />
         <APIErrorBoundary>
            <main>{children}</main>
         </APIErrorBoundary>
      </div>
   );
};

export default PageLayout;
