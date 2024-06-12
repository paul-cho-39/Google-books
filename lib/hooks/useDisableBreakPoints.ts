import { useEffect, useState } from 'react';

const LARGE_BREAK_POINT = 1023;

/**
 * @Component
 * @description - Returns true if the size is bigger than 'size'
 * @param size
 * @returns {boolean} isDisabled
 */
export const useDisableBreakPoints = (size: number = LARGE_BREAK_POINT) => {
   const [isDisabled, setIsDisabled] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > size) {
            // You can set this to whatever breakpoint you want
            setIsDisabled(true);
         } else {
            setIsDisabled(false);
         }
      };
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
   }, [size]);

   return isDisabled;
};
