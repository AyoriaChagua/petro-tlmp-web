import { Button, ExternalLink, ReportLayout, Table } from "../../../components";
import { OrderWithDocumentsI } from "../../../types/reports";
import { TableColumn } from "../../../types/common/table";
import { encryptString } from "../../../utils/functions";
import { GrDocumentPdf, GrDocumentStore } from "react-icons/gr";
import { FaPaperclip, FaRegEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { formatDate1 } from "../../../utils/dates";
import { useOrderDocumentReport } from "../../../hooks/useOrderDocumentReport";
import { MdOutlinePayments } from "react-icons/md";
import React from "react";
import { BiDownload, BiFolderOpen } from "react-icons/bi";
import { getApiBaseUrl } from "../../../api/config";
import { useAuth } from "../../../context/AuthContext";
import { BsFolder } from "react-icons/bs";

export default function OrderDocumentReport() {

    const {
        orderWithDocuments,
        receiveData,
        searchCurrencySymbol,
        handleClickToCreateDocument,
        handleClickToCreateDocumentPayment,
    } = useOrderDocumentReport();

    const { roles } = useAuth();

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
                <>{orderDocument.costcenterAlias || orderDocument.costCenterId}</>
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
                    <Button
                        icon={GrDocumentPdf}
                        styleType="primary"
                        type="button"
                        title="Descargar PDF"
                    />
                    {
                        roles?.includes("LOGISTICA") &&
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
                    <ExternalLink
                        to={`/file-folder-mp/order/${encryptString(JSON.stringify({
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
                                    {Array.from({
                                        length: orderDocument.documents.reduce((maxLength, doc) => {
                                            return doc.payments ? Math.max(maxLength, doc.payments.length) : maxLength;
                                        }, 0)
                                    }).map((_, index) => (<th key={index} className="border px-4 py-2 " colSpan={4}>
                                        Pago {index + 1}
                                    </th>))
                                    }
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
                                                {
                                                    (roles?.includes("TESORERIA")) && (
                                                        <ExternalLink
                                                            to={`/document-mp-voucher-payment/create/${encryptString(orderDocument.companyId)}/${encryptString(doc.orderDocumentNumber)}`}
                                                            onClick={() => handleClickToCreateDocumentPayment({
                                                                companyId: orderDocument.companyId,
                                                                orderDocumentNumber: doc.orderDocumentNumber,
                                                            })}
                                                            color="green"
                                                            title="Registrar pago"
                                                        ><MdOutlinePayments className="text-base" />
                                                        </ExternalLink>
                                                    )
                                                }
                                                <ExternalLink
                                                    to={`/file-folder-mp/document/${encryptString(doc.orderDocumentNumber)}`}
                                                    color="blue"
                                                    title="Carpeta de archivos"
                                                >
                                                    <BsFolder className="text-base" />
                                                </ExternalLink>
                                            </div>
                                        </td>
                                        {(doc.payments && doc.payments?.length > 0) && (
                                            <>
                                                {doc.payments.map((payment, paymentIndex) => (
                                                    <React.Fragment key={paymentIndex}>
                                                        <td className="border px-4 py-2">
                                                            {searchCurrencySymbol(payment.currency)}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {formatCurrency(payment.paidAmount)}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {formatDate1(payment.paymentDate.split("T")[0])}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            {
                                                                payment.paymentFile && (
                                                                    <ExternalLink
                                                                        to={`${getApiBaseUrl()}/file-mp/download/${payment.paymentFile.id}`}
                                                                        color="blue"
                                                                    >
                                                                        <BiDownload className="text-base" />
                                                                    </ExternalLink>
                                                                )
                                                            }
                                                        </td>
                                                    </React.Fragment>
                                                ))}

                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <span>sin documentos</span>
                    )}
                </>
            )
        },
    ]

    return (
        <ReportLayout reportType="general" onSubmit={receiveData}>
            <div className="mt-3">
                <Table<OrderWithDocumentsI> columns={columns} data={orderWithDocuments} />
            </div>
        </ReportLayout>
    )
}
