import { useEffect, useRef } from 'react';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperProps, SwiperSlideProps } from 'swiper/react';

/**
 * @Component
 *
 * @version 11.0.06 - Swiper recommends using Swiper Element. Swiper React is no longer maintained and will likely be discontinued in the future.
 */

declare global {
   namespace JSX {
      interface IntrinsicElements {
         'swiper-container': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
         > & { init?: string };
         'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
   }
}

const Swiper = (props: SwiperProps) => {
   const swiperRef = useRef<SwiperContainer>(null);
   const { children, ...rest } = props;

   useEffect(() => {
      // Register Swiper web component
      register();

      // Object with parameters
      const params = {
         ...rest,
      };

      if (swiperRef.current) {
         // Assign it to swiper element
         Object.assign(swiperRef.current, params);

         // initialize swiper
         swiperRef.current.initialize();
      }
   }, []);

   return (
      <swiper-container ref={swiperRef} init='false'>
         {children}
      </swiper-container>
   );
};

export function SwiperSlide(props: SwiperSlideProps) {
   const { children, ...rest } = props;

   //@ts-expect-error
   return <swiper-slide {...rest}>{children}</swiper-slide>;
}

export default Swiper;
