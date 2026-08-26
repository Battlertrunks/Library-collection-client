import "./BooksWidget.css";

type Props = {
  title: string;
  author: string;
  completionAmount: number;
};

function BooksWidget(props: Props) {
  const { title, author, completionAmount } = props;

  return (
    <div className="mt-4 books-widget bg-gray-100 dark:bg-gray-800 shadow py-3 rounded-xl transition-colors">
      <div className="flex flex-row justify-items-start">
        <img
          className="books-widget__cover ml-3 rounded-xl"
          src="http://books.google.com/books/content?id=bOAw0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
          alt="Books Widget"
        />
        <div className="flex flex-col justify-between pb-4 w-full">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-left ml-5 mr-2">
              {author}
            </p>
          </div>
          <div>
            {/* progress bar */}
            <div className="books-widget__progress-bar bg-gray-300 dark:bg-gray-600 rounded-full h-2 mx-4 mt-5 mb-2">
              <div
                className="books-widget__progress bg-gray-900 dark:bg-white h-2 rounded-full"
                style={{ width: `${completionAmount}%` }}
              />
              <p className="text-sm text-right text-gray-900 dark:text-white">
                {completionAmount}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BooksWidget;
