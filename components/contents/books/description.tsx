import SectionHeader from '@/components/headers/sectionHeader';
import { Suspense, lazy } from 'react';

const BookDescription = lazy(() => import('@/components/bookcover/description'));

interface DescriptionSectionProps {
   description: string | undefined;
}

const DescriptionSection = ({ description }: DescriptionSectionProps) => {
   console.log('DESCRIPTION IS: ', description);
   return (
      <section id='description'>
         <div role='contentinfo' id='book-info' className='my-4 w-full py-2 lg:my-12'>
            <SectionHeader title='Description' />
            <Suspense fallback={null}>
               <BookDescription
                  description={description}
                  descriptionLimit={250}
                  textSize='text-lg'
                  isLink={false}
                  href={''}
               />
            </Suspense>
         </div>
      </section>
   );
};

export default DescriptionSection;
