import { Suspense } from 'react';

import layoutManager from '@/constants/layouts';
import { getContainerWidth } from '@/lib/helper/books/getBookWidth';
import { CombinedData } from '@/lib/types/serverTypes';
import { DescriptionSkeleton } from '../loaders/bookcardsSkeleton';
import CategoryDescription from '../contents/home/categoryDescription';
import { encodeRoutes } from '@/utils/routes';
import { HoveredProps } from '@/lib/hooks/useHoverDisplay';
import { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { CategoryHeaderParams } from '@/constants/categories';

export type HoveredBookDescriptionProps = {
   category: string;
   book: CombinedData;
   isEnabled: boolean;
   isHovered: HoveredProps;
   areImagesLoadComplete: boolean;
   largeEnabled: boolean;
   onMouseLeaveDescription: () => void;
   getUniqueId: (id: string, cat: string) => string;
   floatingRef: React.RefObject<HTMLDivElement>;
   meta: MetaProps;
};

const HoveredBookDescription: React.FC<HoveredBookDescriptionProps> = ({
   book,
   category,
   isEnabled,
   isHovered,
   areImagesLoadComplete,
   largeEnabled,
   getUniqueId,
   onMouseLeaveDescription,
   floatingRef,
   meta,
}) => {
   const HEIGHT = layoutManager.constants.imageHeight;
   if (
      !isEnabled ||
      isHovered.id !== getUniqueId(book.id, category) ||
      !(isHovered.hovered || isHovered.isFloatHovered)
   ) {
      return null;
   }

   return (
      <div
         key={book.id}
         ref={floatingRef}
         onMouseLeave={onMouseLeaveDescription}
         style={{
            height: HEIGHT,
            width: getContainerWidth(HEIGHT, layoutManager.home.widthRatio, largeEnabled),
         }}
         className='absolute z-40 rounded-lg'
      >
         {areImagesLoadComplete && (
            <Suspense fallback={<DescriptionSkeleton />}>
               <CategoryDescription
                  id={book.id}
                  title={book.volumeInfo.title}
                  subtitle={book.volumeInfo.subtitle}
                  authors={book.volumeInfo.authors}
                  description={book.volumeInfo.description}
                  averageRating={book.volumeInfo?.averageRating}
                  totalReviews={book.volumeInfo?.ratingsCount}
                  routeQuery={encodeRoutes.home(category as string, meta)}
               />
            </Suspense>
         )}
      </div>
   );
};

export default HoveredBookDescription;
