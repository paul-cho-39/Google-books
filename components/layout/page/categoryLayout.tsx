import classNames from 'classnames';
import { ReactNode } from 'react';
import { CategoryHeaderParams } from '@/constants/categories';

export interface CategoryLayoutProps {
   category: CategoryHeaderParams;
   children: React.ReactNode;
   className?: string;
}

const CategoryLayout = ({ category, children, className }: CategoryLayoutProps) => {
   return (
      <article
         id={category as string}
         className='xl:ml-14 scrollbarX overflow-y-hidden lg:overflow-hidden'
      >
         <div
            className={classNames(
               className,
               'scrollbarX lg:overflow-x--hidden px-1 py-1 md:max-w-2xl lg:px-2 lg:py-2 lg:max-w-4xl xl:max-w-5xl'
            )}
         >
            {children}
         </div>
      </article>
   );
};

export default CategoryLayout;
