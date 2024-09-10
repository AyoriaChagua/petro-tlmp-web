import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";

interface Props {
    readonly name: string;
    readonly onClick: () => void;
    readonly isOpen: boolean;
}
export default function FolderButton({
    name,
    onClick,
    isOpen
}: Props) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 py-2 px-3 border-2 border-blue-600 rounded-lg ${isOpen ? "text-white bg-blue-600 hover:bg-blue-800" : "text-blue-600 hover:bg-blue-100"} font-semibold `}>
            {isOpen ?
                < FaRegFolderOpen className="text-xl" /> :
                <FaRegFolder className="text-xl" />
            } {name}
        </button>
    )
}
