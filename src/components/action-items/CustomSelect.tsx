import { useState } from "react";
import "./CustomSelect.css";
import type { Option, Options } from "../../types/SelectOptions";

type Props = {
  options: Options;
}

function CustomSelect(props: Props) {
  const { options } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option>(options[0]);

  console.log(isOpen);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        <div className="flex flex-row bg-gray-100 py-2 px-2 rounded-xl text-gray-500 focus:outline-none focus:ring-offset-2 focus:ring-blue-300">
          {selectedValue.label} 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 transition-transform ${isOpen ? "rotate-180" : ""} ml-3`}>
            <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Dropdown  */}
      {isOpen ?
        <ul className={`transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} shadow p-3`}>
          {options.map((option: Option, i: number) => {
            return (
              <li className={i !== options.length - 1 ? "mb-2" : ""}>
                <span>{option.label}</span>
                {i !== options.length - 1 ?
                  <hr className="mt-2 text-gray-300" /> :
                  <></>  
                }
              </li>
            )
          })}
        </ul> :
        <></>
      }
    </div>
  )
}

export default CustomSelect;
