import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { GrDocumentStore } from 'react-icons/gr';

interface Props extends Omit<LinkProps, 'to'> {
    to: string;
    children: React.ReactNode;
}

export default function ExternalLink({ to, children, ...props }: Props) {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.open(to, '_blank');
    };

    return (
        <Link
            to={to}
            onClick={handleClick}
            className="font-medium rounded-lg px-2 py-1.5 mb-2 focus:outline-none focus:ring-4 text-center mt-2 text-blue-600 bg-white hover:bg-blue-200 focus:ring-blue-600 border-2 border-blue-500 flex justify-center items-center gap-2 h-full"
            {...props}
        >
            <GrDocumentStore /> {children}
        </Link>
    );
}