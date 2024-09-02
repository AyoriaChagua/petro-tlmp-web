import { ReportLayout, Table } from "../../../components";
import { usePettyCashReport } from "../../../hooks/usePettyCashReport";
import { TableColumn } from "../../../types/common/table";
import { DocumentReportResponseI } from "../../../types/reports";


export default function PettyCashReport() {
    const {
        pettyCashReport,
        receiveData
    } = usePettyCashReport();
    const columns: TableColumn<DocumentReportResponseI>[] = [
        { key: "correlative", label: "N° orden"},
        { key: "date", label: "Fecha"},
        { key: "total", label: "Monto debe"},
        { key: "currency", label: "Moneda S/D"},
        { key: "exchangeRate", label: "T. cambio"},
        { key: "actions", label: "Doc.", actions: (data) => <>{data.orderDocumentNumber}</>},
        { key: "actions", label: "Num. Doc.",actions: (data) => <>{data.orderDocumentNumber}</>},
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
                <Table<DocumentReportResponseI> columns={columns} data={pettyCashReport} />
            </div>
        </ReportLayout>
    )
}
