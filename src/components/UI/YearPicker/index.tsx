import { useState } from 'react';

interface YearPickerProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
    startYear?: number;
    endYear?: number;
    className?: string;
    disabled?: boolean | undefined | null;
}

export default function YearPicker({
    selectedYear,
    onYearChange,
    startYear = 2024,
    endYear = new Date().getFullYear() + 5,
    className,
    disabled
}: YearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
    );

    function toggleOpen() {
        setIsOpen(!isOpen);
    }
    
    function handleYearSelect(year: number) {
        onYearChange(year);
        setIsOpen(false);
    }

    return (
        <div className={` ${className} mb-4 `}>
            <label htmlFor="" className='block mb-2 text-sm font-medium text-white'>Periodo</label>
            <div className="relative inline-block">
                <button
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                    onClick={toggleOpen}
                    type='button'
                >
                    {selectedYear}
                </button>
                {isOpen && !disabled && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-2 py-2 w-40">
                        {years.map((year) => (
                            <li
                                key={year}
                                className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${year === selectedYear ? 'bg-gray-200' : ''
                                    }`}
                                onClick={() => handleYearSelect(year)}
                            >
                                {year}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}