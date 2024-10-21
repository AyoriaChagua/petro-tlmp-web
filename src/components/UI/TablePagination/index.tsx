import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb';
import { GrCaretPrevious, GrCaretNext } from 'react-icons/gr';


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function TablePagination({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationProps) {
    const goToFirstPage = () => onPageChange(1);
    const goToPreviousPage = () => onPageChange(currentPage - 1);
    const goToNextPage = () => onPageChange(currentPage + 1);
    const goToLastPage = () => onPageChange(totalPages);

    return (
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <div className="flex items-center">
                <select
                    className="mr-4 p-2 border rounded"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    {[10, 15, 20, 25, 30].map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li className="flex flex-row">
                        <button
                            type="button"
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TbPlayerTrackPrev />
                        </button>
                        <button
                            type="button"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <GrCaretPrevious />
                        </button>
                    </li>
                    <li className="flex flex-row">
                        <button
                            type="button"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <GrCaretNext />
                        </button>
                        <button
                            type="button"
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TbPlayerTrackNext />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
