import { ReportLayout, Table } from "../../../components";
import { useDocumentReport } from "../../../hooks/useDocumentReport";
import { ReportResponseI } from "../../../types/reports";
import { getCurrencySymbol } from "../../../utils/functions";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { TableColumn } from "../../../types/common/table";


export default function PurchasingReport() {
    const {
        documentReport,
        receiveData
    } = useDocumentReport();

    const columns: TableColumn<ReportResponseI>[] = [
        { key: "correlative", label: "N° orden" },
        { key: "date", label: "Fecha" },
        { key: "actions", label: "Doc.", actions: (data) => <>{splitVoucher(data.orderDocumentNumber)[0]}</> },
        { key: "actions", label: "Num. Doc.", actions: (data) => <>{splitVoucher(data.orderDocumentNumber)[1]}</> },
        { key: "chargeDate", label: "Fec. Doc." },
        { key: "dueDate", label: "Fec. Venc." },
        { key: "documentProviderDescription", label: "Prov." },
        { key: "documentProviderRuc", label: "Cod. prov." },
        { key: "biog", label: "B.I.O.G y E." },
        { key: "actions", label: "Moneda", actions: (data) => <>{getCurrencySymbol(data.currency)}</>},
        { key: "actions", label: "Total", actions: (data) => <>{formatCurrency(data.total)}</> },
        { key: "actions", label: "IGV", actions: (data) => <>{formatCurrency(data.taxCalc || 0)}</> },
        { key: "annotation", label: "Glosa" },
        { key: "actions", label: "C. Costo", actions: (data) => <>{data.costCenterAlias || data.costCenterId}</> },
        { key: "observations", label: "Comentarios" },
        { key: "typeEmission", label: "Emisión" },
    ]
    return (
        <ReportLayout reportType="purchasing" onSubmit={receiveData}>
            <div className="mt-3">
                <Table<ReportResponseI> columns={columns} data={documentReport} />
            </div>
        </ReportLayout>
    )
}
