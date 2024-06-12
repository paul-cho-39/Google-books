import Router from 'next/router';
import React, { ReactElement, ReactNode, useState } from 'react';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// progress bar
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/globals.css';

// swiperCSS
import 'swiper/css';
import 'swiper/css/pagination';

import ThemeProvider from '@/lib/context/ThemeContext';

import Navigation from '@/components/headers';
import MainLayout from '@/components/layout/page/main';
import SearchFilterProvider from '@/lib/context/SearchFilterContext';
import { NextPage } from 'next';
import { Session } from 'next-auth';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
   getLayout?: (page: ReactElement) => ReactNode;
};

// stating unknown inside the generic because it automatically deletes
// and have no idea what the problem is
type AppPropsWithLayout = AppProps<unknown> & {
   Component: NextPageWithLayout;
   pageProps: {
      session?: Session;
   };
};

// progress loader at the top of the page
NProgress.configure({
   minimum: 0.3,
   easing: 'ease',
   speed: 800,
   showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export function reportWebVitals(metric: NextWebVitalsMetric): void {
   if (metric.label === 'web-vital') {
      console.log(metric);
   }
}

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         // if in production mode may have to turn this on?
         refetchOnWindowFocus: process.env.NODE_ENV === 'production',
         retry: process.env.NODE_ENV === 'production',
         refetchOnReconnect: true,
         refetchOnMount: false,
      },
   },
});

function MyApp({ Component, pageProps }) {
   // defaults to the sidebar open when application starts
   const [isSidebarOpen, setSidebarOpen] = useState(true);
   const { session, ...otherProps } = pageProps;

   const getLayout = Component.getLayout ?? ((page) => page);

   getLayout(<Component {...otherProps} />);

   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider>
            <SessionProvider session={pageProps.session}>
               <SearchFilterProvider>
                  <Navigation sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                  <MainLayout isOpen={isSidebarOpen}>
                     {getLayout(<Component {...otherProps} />)}
                  </MainLayout>
               </SearchFilterProvider>
               <ReactQueryDevtools initialIsOpen={true} />
            </SessionProvider>
         </ThemeProvider>
      </QueryClientProvider>
   );
}

export default MyApp;
