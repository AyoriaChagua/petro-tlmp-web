import { useParams } from "react-router-dom";
import { decryptString } from "../../../utils/functions";
import { useDocumentPayment } from "../../../hooks/useDocumentPayment";
import { Button, CustomSelect, FileInput, IconButton, Input } from "../../../components";
import { currencyOptions } from "../../../utils/constants";

export default function CreatePaymentDocument() {
    const { companyId, orderDocumentNumber } = useParams<{
        companyId: string;
        orderDocumentNumber: string;
    }>();

    const decryptedCompanyId = decryptString(companyId!);
    const decryptedDocumentNumber = decryptString(orderDocumentNumber!);

    const {
        paymentDocumentForm,
        handleAddPayment,
        handleRemovePayment,
        handleInputChange,
        onSubmit,
        handleInputFileChange,
        handleOptionSelection
    } = useDocumentPayment({
        companyId: decryptedCompanyId,
        orderDocumentNumber: decryptedDocumentNumber
    });

    return (
        <div className="flex flex-col w-full gap-3">
            <h2 className="text-2xl font-semibold text-gray-500">
                Pagos <span className="text-base font-normal">({decryptedDocumentNumber})</span>
            </h2>
            <div className="relative p-4 w-full mt-4 border border-gray-300 rounded-xl">
                <div className="absolute -top-5 -right-2 z-10">
                    <IconButton
                        icon="plus"
                        onClick={handleAddPayment}
                    />
                </div>
                <div className="">
                    <form className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 p-5" onSubmit={onSubmit}>
                        {paymentDocumentForm.map((form, index) => (
                            <div key={index} className="relative col-span-1 px-3 pt-2 pb-10 bg-slate-100 rounded-lg ">
                                <Input
                                    id={`amountPaid-${index}`}
                                    typeForm="create"
                                    label="Monto abonado"
                                    type="number"
                                    onChange={(event) => handleInputChange(event, "amountPaid", index)}
                                    value={form.amountPaid}
                                    required
                                />
                                <Input
                                    id={`issueDate-${index}`}
                                    typeForm="create"
                                    label="Fecha importe"
                                    type="date"
                                    onChange={(event) => handleInputChange(event, "issueDate", index)}
                                    value={form.issueDate}
                                    required
                                />
                                <CustomSelect
                                    id="currency"
                                    label="Moneda"
                                    options={currencyOptions}
                                    onChange={(option) => handleOptionSelection(option, index, "currencyValue", "currencyLabel")}
                                    value={form.currencyValue ? {
                                        label: form.currencyLabel,
                                        value: form.currencyValue
                                    } : undefined}
                                    typeForm="create"
                                    placeholder=""
                                    isRequired={true}
                                />
                                <FileInput
                                    id={`file-${index}`}
                                    label="Adjuntar pago"
                                    onChange={(event) => handleInputFileChange(event, index)}
                                />

                                {
                                    index > 0 && (
                                        <div className="absolute -top-0 -right-5">
                                            <IconButton
                                                icon="minus"
                                                onClick={() => handleRemovePayment(index)}
                                            />
                                        </div>
                                    )
                                }

                            </div>
                        ))}
                        <div className="absolute bottom-0 right-2">
                            <Button
                                styleType="primary"
                                type="submit"
                                text="Guardar"
                            />
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}