import React from 'react';

interface Props {
    readonly label: string;
    readonly id: string;
    readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInput({ label, id, onChange }: Props) {
    return (
        <div>
            <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor={id}
            >
                {label}
            </label>
            <input
                className="block w-full text-base text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                id={id}
                type="file"
                onChange={onChange}
            />
        </div>
    );
};
