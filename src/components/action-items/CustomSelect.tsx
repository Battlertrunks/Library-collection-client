import { useState, useEffect, useRef } from "react";
import "./CustomSelect.css";
import type { Option, Options } from "../../types/SelectOptions";

type Props = {
  options: Options;
};

function CustomSelect(props: Props) {
  const { options } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option>(options[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-row justify-between bg-gray-100 py-2 px-2 rounded-xl text-gray-500 focus:outline-none focus:ring-offset-2 focus:ring-blue-300 text-sm min-w-40">
          {selectedValue.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`size-6 transition-transform ${isOpen ? "rotate-180" : ""} ml-3`}
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown  */}
      <ul
        className={`shadow p-3 duration-500 transition-all ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {options.map((option: Option, i: number) => {
          const isSelected = option.value === selectedValue.value;
          return (
            <li
              key={option.value}
              className={`${isSelected ? "py-1" : ""} ${i !== options.length - 1 ? "mb-2" : ""}`}
              onClick={() => {
                if (isOpen) {
                  setSelectedValue(option);
                }
              }}
            >
              <span
                className={`cursor-pointer text-sm select-option ${isSelected ? "selected px-3 py-1.5" : ""}`}
              >
                {option.label}
              </span>
              {i !== options.length - 1 ? (
                <hr
                  className={`text-gray-300 ${isSelected ? "selected mt-3" : "mt-1.5"}`}
                />
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CustomSelect;
