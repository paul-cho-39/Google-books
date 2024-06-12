import { StarIcon } from '@heroicons/react/20/solid';

const sizes = {
   small: { container: 'w-4 h-4', icon: 'w-3 h-3' },
   medium: { container: 'w-6 h-6', icon: 'w-5 h-5' },
   large: { container: 'w-10 h-10', icon: 'w-8 h-8' },
} as const;
export type Size = keyof typeof sizes;

export interface StarProps {
   fillPercentage: number;
   size?: Size;
}

const Star: React.FunctionComponent<StarProps> = ({ fillPercentage, size = 'small' }) => {
   const { container, icon } = sizes[size];
   return (
      <div
         className={`${container} relative`}
         role='img'
         aria-label={`Rating: ${fillPercentage} percent`}
      >
         <StarIcon className={`absolute text-gray-600 dark:text-gray-300 ${icon}`} />
         <div
            style={{ width: `${fillPercentage}%` }}
            className={`overflow-hidden absolute ${icon}`}
         >
            <StarIcon className={`text-yellow-300 ${icon}`} />
         </div>
      </div>
   );
};

export default Star;
