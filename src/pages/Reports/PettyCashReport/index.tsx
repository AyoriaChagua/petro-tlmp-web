import { ReportLayout, Table } from "../../../components";
import { usePettyCashReport } from "../../../hooks/usePettyCashReport";
import { TableColumn } from "../../../types/common/table";
import { PettyCashReportResponseI } from "../../../types/reports";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { getCurrencySymbol } from "../../../utils/functions";


export default function PettyCashReport() {
    const {
        pettyCashReport,
        receiveData
    } = usePettyCashReport();

    const columns: TableColumn<PettyCashReportResponseI>[] = [
        { key: "correlative", label: "N° orden"},
        { key: "date", label: "Fecha"},
        { key: "actions", label: "Monto debe", actions: (data) => <>{formatCurrency(data.total)}</>},
        { key: "actions", label: "Moneda S/D", actions: (data) => <>{getCurrencySymbol(data.currency)}</>},
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
                <Table<PettyCashReportResponseI> columns={columns} data={pettyCashReport} />
            </div>
        </ReportLayout>
    )
}
