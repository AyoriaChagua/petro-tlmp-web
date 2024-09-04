import { Children, ReactNode } from "react"

interface Props {
    readonly children: ReactNode;
    readonly title: string;
}
export default function MaintananceLayout({ children, title }: Props) {
    const [table, form] = Children.toArray(children);
    return (
        <div className="flex flex-col gap-5 mb-5">
            <div className="text-2xl font-bold">
                <h3 className="text-[#055CBB]">{title}</h3>
            </div>
            <div className="flex lg:flex-row flex-col justify-between items-stretch w-full border border-[#055CBB] rounded-xl h-[71vh]">
                <div className="lg:w-7/12 w-full p-5 overflow-auto">
                    {table}
                </div>
                <div className="flex lg:w-5/12 w-full bg-[#055CBB] p-5 flex-grow lg:rounded-tr-xl lg:rounded-br-xl lg:rounded-bl-none rounded-br-xl rounded-bl-xl overflow-auto">
                    {form}
                </div>
            </div>
        </div>
    )
}