import "./Series.css";
// import { useState } from "react";

function Series() {
  // const [customSeries, setCustomSeries] = useState([]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900">Your Crafted</h2>
      <h2 className="text-3xl font-bold mb-25 text-gray-900">Groups</h2>

      {/* If no custom series are stored */}
      <div className="border-gray-900 text-gray-500 h-52 mx-9 rounded-2xl border-dashed border-2 flex flex-col items-center justify-center">
        <p>No custom series?</p>
        <div className="flex flex-col justify-center items-center">
          <p className="mb-1">Let's...</p>
          <button className="bg-gray-800 text-white py-1 px-5 rounded-xl">Create +</button>
        </div>
      </div>

      {/* If the user alreayd has series saved */}
    </div>
  );
}

export default Series;
