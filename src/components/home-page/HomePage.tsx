import ProgressChart from "./ProgressChart";
import BooksWidget from "./BooksWidget";
import FeaturedBook from "./FeaturedBook";

const HomePage = () => {
  const progressItems = [
    { title: "Books Collected", author: "Aron Dembski-Bowden", completionAmount: 50 },
    { title: "Series Completed", author: "Bob", completionAmount: 75 },
    { title: "Upcoming Releases", author: "Alice", completionAmount: 20 },
  ];

  // TODO: Should there be animation effects in this project?

  return (
    <div className="text-center pb-26 px-10 pt-7 text-face scroll-auto overflow-scroll">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Hey there,</h2>
      <h2 className="text-3xl font-bold mb-10 text-gray-900">BattlerTrunks...</h2>

      {/* Wrapper to center the text over the SVG */}
      <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto" }}>
        <ProgressChart percentage={0.52} size={280} strokeWidth={8} startAngle={90} />

        {/* Text Overlay */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4
        }}>
          <span className="text-sm font-normal text-gray-800 tracking-widest">You Own</span>
          <span className="text-6xl font-light text-black tracking-tight">52%</span>
          <span className="text-sm font-normal text-gray-800 tracking-wide">of the Series</span>
        </div>
      </div>

      <hr className="mt-10 bg-gray-800"/>

      {/* Progress so far section */}
      <section className="mt-10">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 text-left">
          Progress so far...
        </h2>
        <ul>
          { progressItems.map((item, index) => (
            <li key={index} className="text-left text-lg text-gray-700 mb-1">
              <BooksWidget
                title={item.title}
                author={item.author}
                completionAmount={item.completionAmount}
              />
            </li>
          )) }
        </ul>
      </section>

      <hr className="mt-10 bg-gray-800"/>

      {/* Book of the Day*/}
      <section>
        <FeaturedBook />
      </section>
    </div>
  );
};

export default HomePage;
