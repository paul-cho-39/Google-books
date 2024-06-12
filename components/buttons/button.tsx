import Spinner from '../loaders/spinner';

interface ButtonProps {
   handleSubmit?: () => void;
   name: string;
   isLoading?: boolean;
   className?: string;
}

export default function Button({ handleSubmit, name, isLoading, className }: ButtonProps) {
   return (
      <button disabled={isLoading} className={className} onClick={handleSubmit}>
         {isLoading ? <Spinner size='sm' color='indigo' /> : name}
         <span className='sr-only'>{isLoading ? 'Loading' : name}</span>
      </button>
   );
}
