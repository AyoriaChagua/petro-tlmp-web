import { useState } from 'react';
import { OptionTypeIcon } from '../../../types/common/inputs';



interface Props {
    title: string;
    options: OptionTypeIcon[];
    onChange: (selectedIds: string[]) => void;
}

function CheckboxSelector({ title, options, onChange }: Props) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleOptionToggle = (id: string) => {
        setSelectedOptions((prev) => {
            const newSelection = prev.includes(id)
                ? prev.filter((optionId) => optionId !== id)
                : [...prev, id];
            onChange(newSelection);
            return newSelection;
        });
    };

    return (
        <div>
            <div className="mb-2 text-base text-gray-600">
                {title}
            </div>
            <ul className="flex flex-row gap-2 flex-wrap">
                {options.map((option) => (
                    <li key={option.value}>
                        <input
                            type="checkbox"
                            id={option.value}
                            value={option.value}
                            className="hidden peer"
                            checked={selectedOptions.includes(option.value)}
                            onChange={() => handleOptionToggle(option.value)}
                        />
                        <label
                            htmlFor={option.value}
                            className="flex w-full items-center justify-between  p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 "
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <option.icon className={`${selectedOptions.includes(option.value) ? "text-blue-600 font-bold": "text-gray-400"} text-4xl h-7`}/>
                                <div className={`w-full ${selectedOptions.includes(option.value) ? "text-blue-600 font-bold": "text-gray-400"}`}>{option.label}</div>
                            </div>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckboxSelector;