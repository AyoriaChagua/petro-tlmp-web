import { TableProps } from "../../../types/common/table";


const Table = <T,>({ columns, data }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-5">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } border-b border-gray-200`}
                        >
                            {columns.map((column, index) => (
                                <td
                                    key={index}
                                    className="px-4 py-1 whitespace-nowrap text-sm text-gray-700"
                                >
                                    {column.key === "actions" && column.actions
                                        ? column.actions(row)
                                        : column.render
                                            ? column.render(row[column.key as keyof T], row)
                                            : row[column.key as keyof T] ?(String(row[column.key as keyof T])) : ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;