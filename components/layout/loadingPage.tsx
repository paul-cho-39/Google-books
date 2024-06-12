import Spinner from '@/components/loaders/spinner';
import NextHead, { NextHeadProps } from '../headers/header';

interface LoadingPageProps extends Partial<NextHeadProps> {}

const LoadingPage = ({ ...props }: LoadingPageProps) => {
   return (
      <div aria-busy={true} className='w-full min-h-screen dark:bg-slate-800'>
         {/* pass next head props here if passed as props */}
         {props.metaTags && props.title && <NextHead {...(props as NextHeadProps)} />}
         <div className='lg:mt-20 mt-12'>
            <Spinner />
         </div>
      </div>
   );
};

export default LoadingPage;
