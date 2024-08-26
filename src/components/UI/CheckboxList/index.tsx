import React from 'react';
import { CheckboxOption } from "../../../types/common/inputs";

interface CheckboxListProps {
  readonly title: string;
  readonly options: CheckboxOption[];
  readonly selectedOptions: string[];
  readonly onSelectionChange: (selectedValues: string[]) => void;
}

export default function CheckboxList({
  title,
  options,
  selectedOptions,
  onSelectionChange
}: CheckboxListProps) {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    const newSelection = isChecked
      ? [...selectedOptions, value]
      : selectedOptions.filter(item => item !== value);
    onSelectionChange(newSelection);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        {options.map((option) => (
          <li key={option.id} className="w-full border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center ps-3">
              <input
                id={option.id}
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor={option.id}
                className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
              >
                {option.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}