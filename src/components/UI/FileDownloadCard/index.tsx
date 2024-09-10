import React, { useCallback, useEffect, useState } from "react";
import { FaRegFileAlt, FaRegFileImage, FaRegFilePdf, FaRegFileWord } from "react-icons/fa";
import { BsFiletypeXls } from "react-icons/bs";
import { IconType } from "react-icons";
import { FileMPI } from "../../../types/file";
import { getApiBaseUrl } from "../../../api/config";
import { Link } from "react-router-dom";

interface Props {
    readonly fileMP: FileMPI;
    readonly onDelete?: (id: number) => void;
}

export default function FileDownloadCard({ fileMP, onDelete }: Props) {
    let icon: IconType = FaRegFileAlt;
    let className = "border-2 border-gray-500 text-gray-500";

    switch (fileMP.extensionFile) {
        case "pdf":
            icon = FaRegFilePdf;
            className = "border-2 border-red-500 text-red-500";
            break;
        case "docx":
        case "doc":
            icon = FaRegFileWord;
            className = "border-2 border-blue-500 text-blue-500";
            break;
        case "jpg":
        case "png":
        case "jpeg":
            icon = FaRegFileImage;
            className = "border-2 border-purple-500 text-purple-500";
            break;
        case "xlsx":
        case "xls":
        case "csv":
            icon = BsFiletypeXls;
            className = "border-2 border-green-500 text-green-500";
            break;
        default:
            break;
    }

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
    }, []);

    const handleClick = useCallback(() => {
        if (contextMenu) setContextMenu(null);
    }, [contextMenu]);

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [handleClick]);

    const downloadUrl = `${getApiBaseUrl()}/file-mp/download/${fileMP.id}`;

    return (
        <div className="relative">
            <Link
                to={downloadUrl}
            >
                <div
                    className={`flex flex-col w-32 h-36 py-3 justify-between ${className} rounded-lg  text-ellipsis`}
                    onContextMenu={handleContextMenu}
                >
                    <div className="mx-auto">
                        {React.createElement(icon, { size: 72 })}
                    </div>
                    <div className="text-center text-xs mt-2 select-none text-ellipsis overflow-hidden">{fileMP.name}</div>

                </div>
            </Link>
            {contextMenu && (
                <div className="absolute  bg-white shadow-lg rounded-lg p-2 w-40 z-10">
                    <ul className="flex flex-col text-xs py-1">
                        <li>
                            <a
                                href={downloadUrl}
                                className="hover:bg-gray-200 p-2 block"
                                onClick={() => setContextMenu(null)}
                            >
                                Descargar archivo
                            </a>
                        </li>
                        <li
                            onClick={() => { onDelete?.(fileMP.id); setContextMenu(null) }}
                            className="hover:bg-gray-200 p-2 cursor-pointer"
                        >
                            Eliminar archivo
                        </li>
                    </ul>
                </div>
            )}
        </div>

    );
}