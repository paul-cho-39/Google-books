import SingleOrMultipleAuthors from '@/components/bookcover/authors';
import BookTitle from '@/components/bookcover/title';
import { BookCardProps } from '@/lib/types/components/bookcards';
import { encodeRoutes } from '@/utils/routes';

type BookTitleAndAuthorProps = Pick<BookCardProps, 'book' | 'query'>;

const BookTitleAndAuthor = ({ book, query }: BookTitleAndAuthorProps) => (
   <div className='row-span-3 mb-6 md:mb-0'>
      <div className='row-start-1 row-end-2 md:max-w-sm'>
         <BookTitle
            id={book.id}
            routeQuery={encodeRoutes.search(query)}
            hasLink
            title={book?.volumeInfo.title}
            subtitle={book?.volumeInfo.subtitle}
            className='text-lg lg:text-xl hover:underline hover:underline-offset-1 hover:decoration-black dark:hover:decoration-slate-300'
         />
      </div>
      <p className='row-start-2 w-full text-sm text-clip space-x-0.5'>
         <span className='dark:text-slate-50'>by{': '}</span>
         <SingleOrMultipleAuthors hoverUnderline={true} authors={book?.volumeInfo.authors} />
      </p>
   </div>
);

export default BookTitleAndAuthor;
