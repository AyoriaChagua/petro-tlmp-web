import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface Props extends Omit<LinkProps, 'to'> {
    readonly to: string;
    readonly children: React.ReactNode;
    readonly handleClick?: () => void;
    readonly color?: "blue" | "green";
}

export default function ExternalLink({ to, children, handleClick, color,...props }: Props) {
    let className = "";
    switch (color) {
        case "blue":
            className = "border-blue-500 text-blue-600 hover:bg-blue-200 focus:ring-blue-600"
            break;
        case "green":
            className = "border-green-500 text-green-600 hover:bg-green-200 focus:ring-green-600"
            break;
        default:
            className = "border-gray-500 text-gray-600 hover:bg-gray-200 focus:ring-gray-600"
            break;
    }
    return (
        <Link
            to={to}
            onClick={handleClick}
            target="_blank"
            className={`font-medium rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:ring-4 text-center mt-2  bg-white  border-2  flex justify-center items-center gap-2 h-full ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
}