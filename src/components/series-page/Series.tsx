import "./Series.css";
// import { useState } from "react";

function Series() {
  // const [customSeries, setCustomSeries] = useState([]);

  return (
    <div className="text-center">
      <div className="mb-15 pt-7">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Crafted
        </h2>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Groups
        </h2>
      </div>

      {/* If no custom series are stored */}
      <div className="border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 h-52 mx-9 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center">
        <p>No custom series?</p>
        <div className="flex flex-col justify-center items-center">
          <p className="mb-1">Let's...</p>
          <button className="bg-gray-800 dark:bg-white text-white dark:text-gray-900 py-1 px-5 rounded-xl transition-colors">
            Create +
          </button>
        </div>
      </div>

      {/* If the user alreayd has series saved */}
    </div>
  );
}

export default Series;
