import { Toaster } from 'react-hot-toast';

export type ToasterMessageType = 'added' | 'removed';

interface MyToastProps {
   shouldDisplayIcon: boolean;
   isAdded?: ToasterMessageType | null;
}

const MyToaster = ({ shouldDisplayIcon = true, isAdded }: MyToastProps) => {
   const getIcon = () => {
      if (!shouldDisplayIcon) {
         return;
      }

      // specific to adding the library
      // if adding more then change the function to switch case or object mapping
      return isAdded === 'added' ? '✔️📚' : '✔️🗑';
   };
   return (
      <Toaster
         toastOptions={{
            success: {
               style: {
                  color: 'WindowText',
                  marginTop: '-0.55rem',
                  fontSize: '16px',
                  backgroundColor: 'aliceblue',
                  borderRadius: '0.8rem',
                  height: '3.4rem',
               },
               icon: getIcon(),
            },
            error: {
               style: {
                  color: 'CaptionText',
                  marginTop: '-0.55rem',
                  fontSize: '16px',
                  height: '3.4rem',
               },
            },
            duration: 1700,
            ariaProps: {
               role: 'status',
               'aria-live': 'assertive',
            },
         }}
      />
   );
};
export default MyToaster;
