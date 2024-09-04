import React, { useState, useEffect, useRef } from "react";
import "./styles.css"

interface Props {
    readonly min: number;
    readonly max: number;
    readonly initialFrom: number;
    readonly initialTo: number;
    readonly onChange?: (from: number, to: number) => void;
    readonly label: string;
}

export default function RangeAmounts({
    min,
    max,
    initialFrom,
    initialTo,
    onChange,
    label
}: Props) {

    const [fromValue, setFromValue] = useState(initialFrom);
    const [toValue, setToValue] = useState(initialTo);

    const fromSliderRef = useRef<HTMLInputElement>(null);
    const toSliderRef = useRef<HTMLInputElement>(null);

    const fillSlider = () => {
        if (fromSliderRef.current && toSliderRef.current) {
            const toSlider = toSliderRef.current;
            const rangeDistance = max - min;
            const fromPosition = fromValue - min;
            const toPosition = toValue - min;

            toSlider.style.background = `linear-gradient(
        to right,
        #C6C6C6 0%,
        #C6C6C6 ${(fromPosition) / rangeDistance * 100}%,
        #0055FF ${(fromPosition) / rangeDistance * 100}%,
        #0055FF ${(toPosition) / rangeDistance * 100}%,
        #C6C6C6 ${(toPosition) / rangeDistance * 100}%,
        #C6C6C6 100%)`;
        }
    };

    const setToggleAccessible = () => {
        if (toSliderRef.current) {
            const toSlider = toSliderRef.current;
            if (toValue <= 0) {
                toSlider.style.zIndex = '2';
            } else {
                toSlider.style.zIndex = '0';
            }
        }
    };

    const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), toValue);
        onChange && onChange(value, toValue);
        setFromValue(value);
    };

    const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), fromValue);
        onChange && onChange(fromValue, value);
        setToValue(value);
    };

    useEffect(() => {
        fillSlider();
        setToggleAccessible();
    }, [fromValue, toValue]);

    return (
        <div className="range_container">
            <label className="mb-5 text-base text-gray-600">
                {label}
            </label>
            <div className="sliders_control mb-7">
                <input
                    id="fromSlider"
                    type="range"
                    min={min}
                    max={max}
                    value={fromValue}
                    ref={fromSliderRef}
                    onChange={handleFromInputChange}
                />
                <input
                    id="toSlider"
                    type="range"
                    min={min}
                    max={max}
                    value={toValue}
                    ref={toSliderRef}
                    onChange={handleToInputChange}
                />
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex float-end flex-col  md:w-1/4 ">
                    <div className="w-full">Min</div>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={fromValue}
                        onChange={handleFromInputChange}
                        className="inputNumber"
                    />
                </div>
                <div className="flex  flex-col  md:w-1/4 text-end">
                    <div className="w-full">Max</div>
                    <input
                        className="text-end inputNumber"
                        type="number"
                        id="toInput"
                        min={min}
                        max={max}
                        value={toValue}
                        onChange={handleToInputChange}
                    />
                </div>
            </div>
        </div>
    );
}