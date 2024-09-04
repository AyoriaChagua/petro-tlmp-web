
import { DateRange, RangeKeyDict, Range } from 'react-date-range';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
    readonly onChange: (item: Range) => void
}

export default function CustomDateRange({ onChange }: Props) {

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [range, setRange] = useState<Range>(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );

    const handleSelect = (item: RangeKeyDict) => {
        const _range = [item.selection][0]
        setRange(_range);
        onChange(_range);
    };

    return (
        <>
            <div className='mb-1 text-base text-gray-600'>Desde - hasta</div>
            <div className="relative">
                <button
                    className='py-2 px-3 border border-gray-200 rounded-lg w-full'
                    onClick={() => setShowDatePicker(!showDatePicker)}>
                    {range.startDate!.toLocaleDateString()} - {range.endDate!.toLocaleDateString()}
                </button>
                {
                    showDatePicker &&
                    <DateRange
                        className='absolute top-11 left-0 border border-gray-200 z-10 rounded-lg'
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={[range]}
                        months={1}
                        direction="horizontal"
                        locale={es}
                        dateDisplayFormat="d MMM yyyy"
                        monthDisplayFormat="MMMM yyyy"
                        weekdayDisplayFormat="EEEEEE"
                    />
                }
            </div>

        </>
    )
}
