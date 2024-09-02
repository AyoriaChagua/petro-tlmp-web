import { IoIosPricetag } from "react-icons/io";

interface Props {
    readonly text: string,
    readonly withIcon?: boolean
    readonly className?: string
}
export default function Tag({ text, withIcon = true, className }: Props) {
    return (
        <div className="relative inline-block cursor-default mr-2">
            {
                withIcon &&
                <IoIosPricetag className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/4 " color="#7973E3" size={20} />
            }
            <div className={`${className ?? "border-2 border-blue-800  bg-blue-700 rounded px-2 text-white text-xs font-medium"}`} >
                <span className=" tracking-wider  ">
                    {text}
                </span>
            </div>
        </div>
    )
}