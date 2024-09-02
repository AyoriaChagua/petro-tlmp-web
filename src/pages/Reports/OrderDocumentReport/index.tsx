import { useState } from "react";
import { Button, ExternalLink, ReportLayout, Table } from "../../../components";
import { OrderWithDocumentsI } from "../../../types/reports";
import { TableColumn } from "../../../types/common/table";
import { encryptString, getCurrencySymbol } from "../../../utils/functions";
import { GrDocumentPdf } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { formatCurrency, splitVoucher } from "../../../utils/formats";
import { formatDate1 } from "../../../utils/dates";
import { useOrderDocumentReport } from "../../../hooks/useOrderDocumentReport";

export default function OrderDocumentReport() {

    const {
        orderWithDocuments,
        receiveData,
        searchCurrencySymbol,
        handleClickToCreateDocument
    } = useOrderDocumentReport();

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
        { key: "products", label: "Detalle" },
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
                    <ExternalLink
                        to={`/document-mp-voucher/create/${encryptString(orderDocument.companyId)}/${encryptString(orderDocument.orderTypeId)}/${encryptString(orderDocument.period)}/${encryptString(orderDocument.correlative)}`}
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
                        })}
                    >
                        +
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
                                    <th className="px-4 py-2">Serie factura</th>
                                    <th className="px-4 py-2">N° Documento</th>
                                    <th className="px-4 py-2">Moneda</th>
                                    <th className="px-4 py-2">Subtotal</th>
                                    <th className="px-4 py-2">IGV</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Glosa</th>
                                    <th className="px-4 py-2">Usuario Sistema</th>
                                    <th className="px-4 py-2">Fecha Comprobante</th>
                                    <th className="px-4 py-2">Estado Comprobante</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDocument.documents.map((doc, docIndex) => (
                                    <tr key={docIndex}>
                                        <td className="border px-4 py-2">{doc.sunatCode}</td>
                                        <td className="border px-4 py-2">{splitVoucher(doc.orderDocumentNumber)[0]}</td>
                                        <td className="border px-4 py-2">{splitVoucher(doc.orderDocumentNumber)[1]}</td>
                                        <td className="border px-4 py-2">{searchCurrencySymbol(orderDocument.currency)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.subtotal)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.retentionCalc || doc.taxCalc || 0)}</td>
                                        <td className="border px-4 py-2">{formatCurrency(doc.total)}</td>
                                        <td className="border px-4 py-2">{doc.annotation}</td>
                                        <td className="border px-4 py-2">{doc.systemUser}</td>
                                        <td className="border px-4 py-2">{formatDate1(doc.date)}</td>
                                        <td className="border px-4 py-2">{doc.documentStatus}</td>
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
