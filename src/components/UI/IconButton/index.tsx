import { IconType } from 'react-icons';
import { BiPlusCircle } from 'react-icons/bi';
import { BsEyeFill } from 'react-icons/bs';
import { FaCreditCard, FaUser, FaPen, FaTrash, FaMinus, FaAngleDoubleUp, FaAngleDoubleDown } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import { MdOutlineFileUpload } from 'react-icons/md';


type IconName = 'card' | 'user' | 'edit' | 'delete' | "eye" | "plus" | "minus" | "show" | "hide" | "reload" | "upload";

interface IconButtonProps {
    readonly icon: IconName;
    readonly onClick?: () => void;
    readonly isSelected?: boolean;
}

const iconMap: Record<IconName, IconType> = {
    card: FaCreditCard,
    user: FaUser,
    edit: FaPen,
    delete: FaTrash,
    eye: BsEyeFill,
    plus: BiPlusCircle,
    minus: FaMinus,
    show: FaAngleDoubleUp,
    hide: FaAngleDoubleDown,
    reload: IoReload,
    upload: MdOutlineFileUpload
};

export default function IconButton({ icon, onClick, isSelected = false }: IconButtonProps) {
    const IconComponent = iconMap[icon];

    const getButtonStyles = () => {
        switch (icon) {
            case 'delete':
                return isSelected ? 'bg-red-600 text-white border-2  border-red-500' : 'bg-red-200 text-red-700 hover:bg-red-300 border-2 border-red-500';
            case 'edit':
                return isSelected ? 'bg-yellow-500 text-white hover:bg-yellow-300 border-2 border-yellow-500' : 'bg-white text-yellow-500 hover:bg-yellow-300 border-2 border-yellow-500';
            case 'upload':
                return isSelected ? 'bg-blue-500 text-white hover:bg-blue-300 border-2 border-blue-500' : 'bg-white text-blue-500 hover:bg-blue-300 border-2 border-blue-500';
            case 'card':
                return isSelected ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700 hover:bg-blue-300';
            case 'user':
                return isSelected ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-700 hover:bg-blue-300';
            case 'eye':
                return isSelected ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700 hover:bg-purple-300';
            case 'plus':
                return 'bg-blue-500  text-white hover:bg-blue-400 text-2xl';
            case 'minus':
                return isSelected ? 'bg-gray-200 text-gray-400 hover:bg-blue-500 hover:text-white' : 'bg-gray-200 text-gray-400 hover:bg-blue-500 hover:text-white text-xl shadow-lg shadow-gray-500/50';
            case 'show':
                return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
            case 'hide':
                return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
            case 'reload':
                return 'bg-transparent text-[#055CBB] text-lg';
            default:
                return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${getButtonStyles()}`}
            type='button'
        >
            <IconComponent />
        </button>
    );
}