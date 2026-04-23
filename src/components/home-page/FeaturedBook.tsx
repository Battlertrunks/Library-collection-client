import './FeaturedBook.css';

function FeaturedBook() {

  const title: string = "The Horus Heresy: Know No Fear";
  const author: string = "Dan Abnett";
  const publish: number = 2019;
  const price: number = 9.99;

  // TODO: Make this a link to the book once the library route has been established
  return (
    <div className='mt-10'>
      <h2 className='text-3xl text-left mb-2 font-bold'>Book of the Day</h2>

      <div className='bg-gray-200 rounded-xl text-center py-4'>
        <div className='py-4'>
          <img
            className="featured-book__cover ml-3 mx-auto inline-block rounded-2xl"
            src="http://books.google.com/books/content?id=bOAw0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            alt="Books Widget"
          />
        </div>

        <h4 className='font-bold text-lg'>{title}</h4>
        <p className='font-extralight text-sm'>by {author}</p>
        <div className='flex justify-center mt-2 text-base'>
          <p>{publish}</p>
          <span className='mx-2'>|</span>
          <p>{price}</p>
        </div>
      </div>
    </div>
  )
}

export default FeaturedBook;
