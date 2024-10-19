import { Link, useParams } from "react-router-dom";
import { decryptString, getCurrencySymbol } from "../../../utils/functions";
import { useDocumentPayment } from "../../../hooks/useDocumentPayment";
import { Button, CustomSelect, FileInput, IconButton, Input, MaintananceLayout, Table } from "../../../components";
import { currencyOptions } from "../../../utils/constants";
import { PaymentResponseI } from "../../../types/order-document";
import { TableColumn } from "../../../types/common/table";
import { formatDate1 } from "../../../utils/dates";
import { FaRegFile } from "react-icons/fa";
import { getApiBaseUrl } from "../../../api/config";

export default function CreatePaymentDocument() {
    const { companyId, period, correlative, orderTypeId } = useParams<{
        companyId: string;
        period: string;
        correlative: string;
        orderTypeId: string;
    }>();

    const decryptedCompanyId = decryptString(companyId!);
    const decryptedPeriod = decryptString(period!);
    const decryptedCorrelative = decryptString(correlative!);
    const decryptedOrderTypeId = decryptString(orderTypeId!);

    const {
        paymentDocumentForm,
        handleInputChange,
        onSubmit,
        handleInputFileChange,
        handleOptionSelection,
        paymentDocuments,
        paymentIdToUpdate,
        handlePaymentEdit,
        handlePaymentFileSelect,
        uploadOnlyFile,
        handleDeletePayment
    } = useDocumentPayment({
        companyId: decryptedCompanyId,
        correlative: decryptedCorrelative,
        orderTypeId: decryptedOrderTypeId,
        period: decryptedPeriod
    });

    const columns: TableColumn<PaymentResponseI>[] = [
        { key: "actions", "label": "Fecha de pago", actions: (payment) => <>{formatDate1(payment.paymentDate.toString().split("T")[0])}</> },
        { key: "actions", "label": "Moneda", actions: (payment) => <>{getCurrencySymbol(payment.currency)}</> },
        { key: "paidAmount", "label": "Monto abonado" },
        { key: "systemUser", "label": "Usuario" },
        {
            key: "actions", "label": "Archivo", actions: (payment) => <>{payment.fileId ?
                <Link
                    className="inline-block text-blue-600 border-2 border-blue-600 rounded-lg px-3 py-2 hover:bg-blue-200"
                    to={`${getApiBaseUrl()}/file-mp/download/${payment.fileId}`}>
                    <FaRegFile />
                </Link> :
                <Button
                    icon={FaRegFile}
                    styleType="dark"
                    type="button"
                    title="Sin archivo"
                    disabled
                />}</>
        },
        {
            key: "actions", label: "Acciones", actions: (payment) => (
                <div className="flex flex-row gap-2">
                    <IconButton icon="upload" isSelected={paymentIdToUpdate === payment.paymentId && uploadOnlyFile} onClick={() => handlePaymentFileSelect(payment)} />
                    <IconButton icon="edit" isSelected={paymentIdToUpdate === payment.paymentId && !uploadOnlyFile} onClick={() => handlePaymentEdit(payment)} />
                    <IconButton icon="delete" isSelected onClick={() => handleDeletePayment(payment.paymentId)} />
                </div>
            )
        },
    ]
    return (
        <MaintananceLayout title="Pagos">
            <Table<PaymentResponseI> columns={columns} data={paymentDocuments.filter(payment => payment.isActive)} />
            <form className="flex w-full flex-col" onSubmit={onSubmit}>
                <div className="relative col-span-1 px-3 pt-2 pb-3 bg-slate-100 rounded-lg ">
                    {
                        !uploadOnlyFile &&
                        <>
                            <Input
                                id={`amountPaid`}
                                typeForm="create"
                                label="Monto abonado"
                                type="number"
                                onChange={(event) => handleInputChange(event, "amountPaid")}
                                value={paymentDocumentForm.amountPaid}
                                required
                            />
                            <Input
                                id={`issueDate`}
                                typeForm="create"
                                label="Fecha importe"
                                type="date"
                                onChange={(event) => handleInputChange(event, "issueDate")}
                                value={paymentDocumentForm.issueDate}
                                required
                            />
                            <CustomSelect
                                id="currency"
                                label="Moneda"
                                options={currencyOptions}
                                onChange={(option) => handleOptionSelection(option, "currencyValue", "currencyLabel")}
                                value={paymentDocumentForm.currencyValue ? {
                                    label: paymentDocumentForm.currencyLabel,
                                    value: paymentDocumentForm.currencyValue
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                                isRequired={true}
                            />
                        </>
                    }
                    {
                        (!paymentIdToUpdate || uploadOnlyFile) &&
                        <FileInput
                            id={`file`}
                            label="Adjuntar pago"
                            onChange={(event) => handleInputFileChange(event)}
                        />
                    }
                </div>
                <Button
                    styleType="form"
                    type="submit"
                    text="Guardar"
                />
            </form>
        </MaintananceLayout>
    );
}