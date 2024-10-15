import { Button, ExternalLink, Loader, ReportLayout, Table } from "../../../components";
import { FieldsOrderID, OrderWithDocumentsI } from "../../../types/reports";
import { TableColumn } from "../../../types/common/table";
import { encryptString } from "../../../utils/functions";
import { GrDocumentStore } from "react-icons/gr";
import { FaRegEdit, FaRegFilePdf } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { formatDate1 } from "../../../utils/dates";
import { useOrderDocumentReport } from "../../../hooks/useOrderDocumentReport";
import { MdOutlinePayments } from "react-icons/md";
//import React from "react";
//import { BiDownload } from "react-icons/bi";
//import { getApiBaseUrl } from "../../../api/config";
import { useAuth } from "../../../context/AuthContext";
import { BsFolder } from "react-icons/bs";
import { getOrder } from "../../../api/order/get";
import { showErrorMessage } from "../../../utils/alerts";

export default function OrderDocumentReport() {

    const {
        orderWithDocuments,
        receiveData,
        searchCurrencySymbol,
        handleClickToCreateDocument,
        handleClickToCreateDocumentPayment,
        downloadingStates,
        setDownloadingStates
    } = useOrderDocumentReport();

    const { roles } = useAuth();

    const handleDownloadPDF = async (fields: FieldsOrderID) => {
        const key = `${fields.companyId}-${fields.correlative}`;
        setDownloadingStates(prev => ({ ...prev, [key]: true }));
        try {
            await getOrder.generatePdf(fields);
        } catch (error) {
            console.error(error);
            
            showErrorMessage("Error al generar el PDF");
            setDownloadingStates(prev => ({ ...prev, [key]: false }));
        } finally {
            setDownloadingStates(prev => ({ ...prev, [key]: false }));
        }

    }

    const columns: TableColumn<OrderWithDocumentsI>[] = [
        { key: "orderTypeId", label: "Tipo Orden" },
        { key: "correlative", label: "N° de Orden" },
        {
            key: "actions", label: "Fecha Orden", actions: (orderDocument) => (
                <>{formatDate1(orderDocument.orderDate)}</>
            )
        },
        { key: "companyId", label: "Compañia" },
        { key: "systemUser", label: "Usuario" },
        { key: "providerDescription", label: "Proveedor" },
        { key: "providerRuc", label: "RUC" },
        {
            key: "actions",
            label: "Detalle",
            actions: (orderDocument) => (
                <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {orderDocument.products}
                </div>
            ),
        },
        {
            key: "actions", label: "Destino", actions: (orderDocument) => (
                <>{orderDocument.costCenterDescription}</>
            )
        },
        {
            key: "actions", label: "Moneda", actions: (orderDocument) => (
                <>{searchCurrencySymbol(orderDocument.currency)}</>
            )
        },
        {
            key: "actions", label: "Importe Total", actions: (orderDocument) => (
                <>{formatCurrency(orderDocument.total)}</>
            )
        },
        {
            key: "actions", label: "Acciones", actions: (orderDocument) => (
                <div className="flex flex-row justify-center items-center gap-1 ">
                    {
                        
                        (downloadingStates[`${orderDocument.companyId}-${orderDocument.correlative}`]) ? (
                            <div className="w-9">
                                <Loader size="small" type="spiner" />
                            </div>
                        ) : (

                            <Button
                                icon={FaRegFilePdf}
                                styleType="primary"
                                type="button"
                                title="Editar Orden"
                                onClick={
                                    () => handleDownloadPDF({
                                        companyId: orderDocument.companyId.trim(),
                                        correlative: orderDocument.correlative.trim(),
                                        orderTypeId: orderDocument.orderTypeId.trim(),
                                        period: orderDocument.period.trim()
                                    })}
                            />
                        )
                    }
                    {
                        (roles?.includes("LOGISTICA") === null) &&
                        <>
                            <Button
                                icon={FaRegEdit}
                                styleType="primary"
                                type="button"
                                title="Editar Orden"
                            />
                            <Button
                                icon={IoCopyOutline}
                                styleType="primary"
                                type="button"
                                title="Crear copia"
                            />
                        </>
                    }
                    {
                        roles?.includes("MESA DE PARTES") &&
                        <ExternalLink
                            to={`/document-mp-voucher/document-form/${encryptString(orderDocument.companyId)}/${encryptString(orderDocument.orderTypeId)}/${encryptString(orderDocument.period)}/${encryptString(orderDocument.correlative)}`}
                            onClick={() => handleClickToCreateDocument({
                                orderTypeId: orderDocument.orderTypeId,
                                period: orderDocument.period,
                                companyId: orderDocument.companyId,
                                correlative: orderDocument.correlative,
                                currency: orderDocument.currency,
                                total: orderDocument.total,
                                tax: orderDocument.tax,
                                perception: orderDocument.perception,
                                detraction: orderDocument.detraction,
                                retention: orderDocument.retention,
                                costCenter: orderDocument.costCenterDescription
                            })}
                            color="blue"
                        >
                            <GrDocumentStore /> +
                        </ExternalLink>
                    }
                    {
                        // (roles?.includes("TESORERIA")) && (
                        <ExternalLink
                            to={`/document-mp-voucher-payment/create/${encryptString(orderDocument.companyId)}/${encryptString(orderDocument.orderTypeId)}/${encryptString(orderDocument.correlative)}/${encryptString(orderDocument.period)}`}
                            onClick={() => handleClickToCreateDocumentPayment({
                                companyId: orderDocument.companyId,
                                orderTypeId: orderDocument.orderTypeId,
                                period: orderDocument.period,
                                correlative: orderDocument.correlative,
                            })}
                            color="green"
                            title="Registrar pago"
                        ><MdOutlinePayments className="text-base" />
                        </ExternalLink>
                        //)
                    }
                    <ExternalLink
                        to={`/file-folder-mp/${encryptString(JSON.stringify({
                            companyId: orderDocument.companyId,
                            orderTypeId: orderDocument.orderTypeId,
                            period: orderDocument.period,
                            correlative: orderDocument.correlative
                        }))}`}
                        color="blue"
                        title="Carpeta de archivos"
                    >
                        <BsFolder className="text-base" />
                    </ExternalLink>
                </div>
            )
        },
        {
            key: "actions", label: "Documentos", actions: (orderDocument) => (
                <>
                    {orderDocument.documents.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Código comprobante</th>
                                    <th className="px-4 py-2 sticky">Serie factura</th>
                                    <th className="px-4 py-2 sticky">N° Documento</th>
                                    <th className="px-4 py-2">Moneda</th>
                                    <th className="px-4 py-2">Subtotal</th>
                                    <th className="px-4 py-2">IGV</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Glosa</th>
                                    <th className="px-4 py-2">Usuario Sistema</th>
                                    <th className="px-4 py-2">Fecha Comprobante</th>
                                    <th className="px-4 py-2">Estado Comprobante</th>
                                    <th className="px-4 py-2">Acciones</th>

                                </tr>
                            </thead>
                            <tbody>
                                {orderDocument.documents.map((doc, docIndex) => (
                                    <tr key={docIndex}>
                                        <td className="border px-4 py-2">{doc.sunatCode}</td>
                                        <td className="border px-4 py-2 sticky">{splitVoucher(doc.orderDocumentNumber)[0]}</td>
                                        <td className="border px-4 py-2 sticky">{splitVoucher(doc.orderDocumentNumber)[1]}</td>
                                        <td className="border px-4 py-2">{searchCurrencySymbol(orderDocument.currency)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.subtotal)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.retentionCalc || doc.taxCalc || 0)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.total)}</td>
                                        <td className="border px-4 py-2">{doc.annotation}</td>
                                        <td className="border px-4 py-2">{doc.systemUser}</td>
                                        <td className="border px-4 py-2">{formatDate1(doc.date)}</td>
                                        <td className="border px-4 py-2">{doc.documentStatus}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex flex-row justify-center items-center gap-1 ">
                                                {roles?.includes("MESA DE PARTES") && (
                                                    <ExternalLink
                                                        to={`/document-mp-voucher/document-form/${encryptString(orderDocument.companyId)}/${encryptString(orderDocument.orderTypeId)}/${encryptString(orderDocument.period)}/${encryptString(orderDocument.correlative)}/${encryptString(doc.orderDocumentNumber)}`}
                                                        color="blue"
                                                        title="Editar documento"
                                                        onClick={() => handleClickToCreateDocument({
                                                            orderTypeId: orderDocument.orderTypeId,
                                                            period: orderDocument.period,
                                                            companyId: orderDocument.companyId,
                                                            correlative: orderDocument.correlative,
                                                            currency: orderDocument.currency,
                                                            total: orderDocument.total,
                                                            tax: orderDocument.tax,
                                                            perception: orderDocument.perception,
                                                            detraction: orderDocument.detraction,
                                                            retention: orderDocument.retention,
                                                            costCenter: orderDocument.costCenterDescription
                                                        })}
                                                    >
                                                        <FaRegEdit />
                                                    </ExternalLink>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <span>Sin documentos</span>
                    )}
                </>
            )
        },
        {
            key: "actions", label: "Pagos", actions: (orderDocument) => (
                <>
                    {orderDocument.payments.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Fecha de pago</th>
                                    <th className="px-4 py-2">Moneda</th>
                                    <th className="px-4 py-2">Monto pagado</th>
                                    <th className="px-4 py-2">Acciones</th>
                                    {/*</tr>{searchCurrencySymbol(payment.currency)}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {formatCurrency(payment.paidAmount)}</td>*/}

                                </tr>
                            </thead>
                            <tbody>
                                {orderDocument.payments.map((pay, docIndex) => (
                                    <tr key={docIndex}>
                                        <td className="border px-4 py-2">{formatDate1(pay.paymentDate.split("T")[0])}</td>
                                        <td className="border px-4 py-2">{searchCurrencySymbol(orderDocument.currency)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(pay.paidAmount)}</td>
                                        <td className="border px-4 py-2">

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<span>Sin pagos</span>)}
                </>
            )
        }
    ]

    return (
        <ReportLayout reportType="general" onSubmit={receiveData}>
            <div className="mt-3">
                <Table<OrderWithDocumentsI> columns={columns} data={orderWithDocuments} />
            </div>
        </ReportLayout>
    )
}
