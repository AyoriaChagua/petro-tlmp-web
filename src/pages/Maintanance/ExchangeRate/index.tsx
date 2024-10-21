import { Table, TablePagination } from '../../../components'
import { ExchangeRateResponseI } from '../../../types/exchange-rate'
import { useExchangeRate } from '../../../hooks/useExchangeRate'
import { TableColumn } from '../../../types/common/table';
import { formatDate1 } from '../../../utils/dates';

export default function ExchangeRate() {
    const {
        exchangeRates,
        paginationOptions,
        changeItemsPerPage,
        handlePageChange,
    } = useExchangeRate();

    const columns: TableColumn<ExchangeRateResponseI>[] = [
        { key: "actions", label: "Fecha", actions: (exchange) => <>{formatDate1(exchange.date.toString().split("T")[0])}</> },
        { key: "purchase_price", label: "Compra" },
        { key: "sale_price", label: "Venta" },
    ];

    return (
        <div>
            <Table<ExchangeRateResponseI> columns={columns} data={exchangeRates} />
            <TablePagination
                currentPage={paginationOptions.currentPage}
                totalPages={paginationOptions.totalPages}
                itemsPerPage={paginationOptions.itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={changeItemsPerPage}
            />
        </div>
    )
}
