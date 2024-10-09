import { useParams } from "react-router-dom";
import { decryptString, getCurrencySymbol } from "../../../utils/functions";
import { useDocumentPayment } from "../../../hooks/useDocumentPayment";
import { Button, CustomSelect, FileInput, Input, MaintananceLayout, Table } from "../../../components";
import { currencyOptions } from "../../../utils/constants";
import { PaymentResponseI } from "../../../types/order-document";
import { TableColumn } from "../../../types/common/table";
import { formatDate1 } from "../../../utils/dates";

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
        paymentDocuments
    } = useDocumentPayment({
        companyId: decryptedCompanyId,
        correlative: decryptedCorrelative,
        orderTypeId: decryptedOrderTypeId,
        period: decryptedPeriod
    });

    const columns: TableColumn<PaymentResponseI>[] = [
        { key: "actions", "label": "Fecha de pago", actions: (data) => <>{formatDate1(data.paymentDate.toString().split("T")[0])}</> },
        { key: "actions", "label": "Moneda", actions: (data) => <>{getCurrencySymbol(data.currency)}</> },
        { key: "paidAmount", "label": "Monto abonado" },
        { key: "systemUser", "label": "Usuario" },
    ]

    return (
        <MaintananceLayout title="Pagos">
            <Table<PaymentResponseI> columns={columns} data={paymentDocuments} />
            <form className="flex w-full flex-col" onSubmit={onSubmit}>
                <div className="relative col-span-1 px-3 pt-2 pb-10 bg-slate-100 rounded-lg ">
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
                    <FileInput
                        id={`file`}
                        label="Adjuntar pago"
                        onChange={(event) => handleInputFileChange(event)}
                    />

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