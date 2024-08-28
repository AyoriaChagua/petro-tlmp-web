import { IconType } from 'react-icons';

type ButtonProps = {
    styleType: 'dark' | 'danger' | 'success' | 'primary' | 'purple' | 'warning' | 'form';
    text: string;
    icon?: IconType;
    onClick?: () => void;
    type: "button" | "reset" | "submit";
    isFilled?: boolean | undefined | null;
};

export default function Button ({ styleType, text, icon: Icon, onClick, type, isFilled }: ButtonProps)  {
    let baseClasses = ` font-medium rounded-lg text-lg px-2 py-1.5  mb-2 focus:outline-none focus:ring-4 ${text && "text-center mt-2"}`;
    let typeClasses = "";

    switch (styleType) {
        case 'primary':
            typeClasses = isFilled ? "text-white bg-[#055CBB] hover:bg-blue-800 focus:ring-blue-300 border-2 border-blue-500" : "text-blue-600 bg-white hover:bg-blue-200 focus:ring-blue-600 border-2 border-blue-500";
            break;
        case 'dark':
            typeClasses = isFilled ? "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 border-2 border-black" : "text-black bg-white hover:bg-gray-200 focus:ring-gray-600 border-2 border-black";
            break;
        case 'danger':
            typeClasses = isFilled ? "text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 border-2 border-red-500" : "text-red-600 bg-white hover:bg-red-200 focus:ring-red-600 border-2 border-red-500";
            break;
        case 'success':
            typeClasses = isFilled ? "text-white bg-green-600 hover:bg-green-700 focus:ring-green-300 border-2 border-green-500" : "text-green-600 bg-white hover:bg-green-200 focus:ring-green-600 border-2 border-green-500";
            break;
        case 'purple':
            typeClasses = isFilled ? "text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-300 border-2 border-purple-500" : "text-purple-600 bg-white hover:bg-purple-200 focus:ring-purple-600 border-2 border-purple-500";
            break;
        case 'warning':
            typeClasses = isFilled ? "text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-200 border-2 border-yellow-500" : "text-yellow-600 bg-white hover:bg-yellow-200 focus:ring-yellow-600 border-2 border-yellow-500";
            break;
        case 'form':
            typeClasses = "text-white bg-[#40A2D8] hover:bg-[#2595D3]";
            break;
        default:
            typeClasses = "text-white bg-[#055CBB] hover:bg-blue-800 focus:ring-blue-300";
    }

    return (
        <button type={type} className={`${baseClasses} ${typeClasses}`} onClick={onClick}>
            {Icon && <Icon />}
            {text}
        </button>
    );
};

