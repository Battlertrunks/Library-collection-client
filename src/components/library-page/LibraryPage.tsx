import type { Options } from "../../types/SelectOptions";
import CustomSelect from "../action-items/CustomSelect";
import "./LibraryPage.css";

const options: Options = [
  { id: 1, label: "Recently Added", value: "recent" },
  { id: 2, label: "Name A to Z", value: "az" },
  { id: 2, label: "Name Z to A", value: "za" },
  { id: 3, label: "Date Published", value: "publish" },
  { id: 4, label: "Completion", value: "completion" },
];

function LibraryPage() {
  return (
    <div>
      <div className="mb-10 pt-7 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Collection
        </h2>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Thus Far
        </h2>
      </div>

      {/* Searrch and Sort By action items */}
      <div className="flex flex-row justify-center mx-8 pt-10">
        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-white">Search:</span>
          <input
            type="text"
            placeholder="Looking for..."
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 search-inp py-2 pl-2 rounded-xl text-sm"
          />
        </div>
        <div>
          <span>Sort By:</span>
          <CustomSelect options={options} />
        </div>
      </div>
    </div>
  );
}

export default LibraryPage;
