import { ReportLayout, Table } from "../../../components";
import { useDocumentReport } from "../../../hooks/useDocumentReport";
import { TableColumn } from "../../../types/common/table";
import { ReportResponseI } from "../../../types/reports";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { getCurrencySymbol } from "../../../utils/functions";


export default function PettyCashReport() {
    const {
        documentReport,
        receiveData
    } = useDocumentReport();

    const columns: TableColumn<ReportResponseI>[] = [
        { key: "correlative", label: "N° orden"},
        { key: "date", label: "Fecha"},
        { key: "actions", label: "Moneda", actions: (data) => <>{getCurrencySymbol(data.currency)}</>},
        { key: "actions", label: "Monto debe", actions: (data) => <>{formatCurrency(data.total)}</>},
        { key: "actions", label: "T. cambio", actions: (data) => <>{formatCurrency(data.exchangeRate)}</>},
        { key: "actions", label: "Doc.", actions: (data) => <>{splitVoucher(data.orderDocumentNumber)[0]}</>},
        { key: "actions", label: "Num. Doc.",actions: (data) => <>{splitVoucher(data.orderDocumentNumber)[1]}</>},
        { key: "chargeDate", label: "Fec. Doc."},
        { key: "providerRuc", label: "Cod. prov. clie."},
        { key: "dueDate", label: "Fec. Ven."},
        { key: "actions", label: "C. Costo", actions: (data) => <>{data.costCenterAlias || data.costCenterId}</>},
        { key: "annotation", label: "Glosa"},
        { key: "providerRuc", label: "Ruc"},
        { key: "providerDescription", label: "R. Social"},
    ]
    return (
        <ReportLayout reportType="pettyCash" onSubmit={receiveData}>
            <div className="mt-3">
                <Table<ReportResponseI> columns={columns} data={documentReport} />
            </div>
        </ReportLayout>
    )
}
