import { useParams } from "react-router-dom";
import { decryptString, getCurrencySymbol } from "../../../utils/functions";
import { useOrderDocument } from "../../../hooks/useOrderDocument";
import { CustomSelect, Input, Tag, ToggleButton } from "../../../components";
import { formatCurrency } from "../../../utils/formats";
import { convertStringToDate1, formatDate2 } from "../../../utils/dates";
import { detractionOptions, issueTypeOptions, perceptionOptions } from "../../../utils/constants";

export default function CreateDocument() {

    const { orderCompanyId, orderTypeId, orderPeriod, orderCorrelative } = useParams<{
        orderCompanyId: string;
        orderTypeId: string;
        orderPeriod: string;
        orderCorrelative: string;
    }>();

    const decryptedCompanyId = decryptString(orderCompanyId!);
    const decryptedOrderTypeId = decryptString(orderTypeId!);
    const decryptedOrderPeriod = decryptString(orderPeriod!);
    const decryptedOrderCorrelative = decryptString(orderCorrelative!);


    const {
        orderData,
        documentForm,
        documentTypeOptions,
        setDocumentForm,
        handleOptionSelection,
        handleInputChange,
        handleBlurInputDocumentNumber,
        onSubmit,
        getTotal
    } = useOrderDocument({
        companyId: decryptedCompanyId,
        orderTypeId: decryptedOrderTypeId,
        period: decryptedOrderPeriod,
        correlative: decryptedOrderCorrelative
    });

    const getTaxOrRetention = () => {
        if (orderData.tax) {
            return "IGV " + orderData.tax + "%";
        } else if (orderData.retention) {
            return "RET " + orderData.retention + "%";
        } else {
            return "No afecto";
        }
    }



    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-gray-500">Crear nuevo comprobante <span className="text-base font-normal">({orderData.orderTypeId} #{orderData.correlative})</span></h1>
                    <div className="flex flex-row gap-3">
                        <Tag
                            withIcon={false}
                            className="rounded-md border-2 border-blue-600 text-blue-500 bg-white px-2 py-1 text-xs font-semibold"
                            text={getTaxOrRetention()}
                        />
                        <Tag
                            withIcon={false}
                            className="rounded-md border-2 border-blue-600 text-blue-500 bg-white px-2 py-1 text-xs font-semibold"
                            text={`Tipo de moneda: ${getCurrencySymbol(orderData.currency ?? "")}`}
                        />
                        <Tag
                            withIcon={false}
                            className="rounded-md border-2 border-blue-600 text-blue-500 bg-white px-2 py-1 text-xs font-semibold"
                            text={`Total: ${formatCurrency(orderData.total)}`}
                        />
                    </div>
                </div>
                <ToggleButton
                    checked={documentForm.isPettyCash}
                    onChange={() => setDocumentForm(prevState => ({
                        ...prevState,
                        isPettyCash: !prevState.isPettyCash
                    }))}
                    name="Caja chica"
                />
            </div>

            <hr className="my-5" />
            <form className="grid grid-cols-2 gap-4 mb-10" onSubmit={onSubmit}>
                <div className="md:col-span-1 col-span-2">
                    <CustomSelect
                        id="documentType"
                        label="Tipo de comprobante"
                        onChange={(option) => handleOptionSelection(option, "documentTypeValue", "documentTypeLabel")}
                        options={documentTypeOptions}
                        value={documentForm.documentTypeValue ? {
                            label: documentForm.documentTypeLabel,
                            value: documentForm.documentTypeValue
                        } : undefined}
                        typeForm="create"
                        isRequired
                    />
                </div>
                <div className="col-span-1">
                    <CustomSelect
                        id="issueType"
                        label="Tipo de emisión"
                        onChange={(option) => handleOptionSelection(option, "issueTypeValue", "issueTypeLabel")}
                        options={issueTypeOptions}
                        value={documentForm.issueTypeValue ? {
                            label: documentForm.issueTypeLabel,
                            value: documentForm.issueTypeValue
                        } : undefined}
                        typeForm="create"
                        isRequired
                    />
                </div>

                <div className="col-span-1">
                    <Input
                        id="receptionDate"
                        label="Fecha de recepción"
                        onChange={(e) => { handleInputChange(convertStringToDate1(e.target.value), "receiptDate") }}
                        typeForm="create"
                        type="date"
                        value={formatDate2(documentForm.receiptDate)}
                        required
                    />
                </div>
                <div className="col-span-1">
                    <Input
                        id="issueDate"
                        label="Fecha de emisión"
                        onChange={(e) => { handleInputChange(convertStringToDate1(e.target.value), "issueDate") }}
                        typeForm="create"
                        type="date"
                        value={formatDate2(documentForm.issueDate)}
                        required
                    />
                </div>
                <div className="col-span-1">
                    <Input
                        id="dueDate"
                        label="Fecha de vencimiento"
                        onChange={(e) => { handleInputChange(convertStringToDate1(e.target.value), "dueDate") }}
                        typeForm="create"
                        type="date"
                        value={formatDate2(documentForm.dueDate)}
                        required
                    />
                </div>
                <div className="col-span-1">
                    <Input
                        id="exchangeRate"
                        label="Cambio dolar"
                        typeForm="create"
                        value={documentForm.exchangeRate.toString()}
                        disabled
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <Input
                        id="annotation"
                        label="Glosa"
                        onChange={(e) => { handleInputChange(e.target.value.toUpperCase(), "annotation") }}
                        value={documentForm.annotation}
                        typeForm="create"
                    />
                </div>
                <div className="col-span-1">
                    <Input
                        id="code"
                        label="Código"
                        onChange={(e) => { handleInputChange(e.target.value, "code") }}
                        value={documentForm.code}
                        typeForm="create"
                    />
                </div>

                {
                    orderData.perception &&
                    <div className="col-span-1">
                        <CustomSelect
                            id="perceptionPerc"
                            label="Percepción"
                            onChange={(option) => handleOptionSelection(option, "perceptionPercValue", "perceptionPercLabel")}
                            value={documentForm.perceptionPercValue ? {
                                label: documentForm.perceptionPercLabel,
                                value: documentForm.perceptionPercValue
                            } : undefined}
                            options={perceptionOptions}
                            typeForm="create"
                        />
                    </div>
                }
                {
                    orderData.detraction &&
                    <div className="col-span-1">
                        <CustomSelect
                            id="detractionPerc"
                            label="Detracción"
                            onChange={(option) => handleOptionSelection(option, "detractionPercValue", "detractionPercLabel")}
                            value={documentForm.detractionPercValue ? {
                                label: documentForm.detractionPercLabel,
                                value: documentForm.detractionPercValue
                            } : undefined}
                            options={detractionOptions}
                            typeForm="create"
                        />
                    </div>
                }
                <div className="col-span-1">
                    <Input
                        id="biorge"
                        label="B.I.O.R.G y E. (A)"
                        onChange={(e) => { handleInputChange(e.target.value, "biorgeya") }}
                        value={documentForm.subtotal}
                        typeForm="create"
                        type="number"
                        placeholder="Autocompletado con el subtotal"
                    />
                </div>

                <hr className="my-5 col-span-2" />
                <div className="col-span-2 md:col-span-1">
                    <Input
                        id="orderDocumentNumber"
                        label="N° de comprobante"
                        onChange={(e) => { handleInputChange(e.target.value.toUpperCase(), "orderDocumentNumber") }}
                        value={documentForm.orderDocumentNumber}
                        onBlur={handleBlurInputDocumentNumber}
                        typeForm="create"
                        required
                    />
                </div>
                <div className="col-span-1 col-start-2 col-end-3">
                    <Input
                        id="subtotal"
                        label="Subtotal"
                        onChange={(e) => handleInputChange(e.target.value, "subtotal")}
                        value={documentForm.subtotal}
                        typeForm="create"
                        type="number"
                        required
                    />
                </div>
                <div className="col-span-1 col-start-2 col-end-3">
                    <div className="flex w-full items-center gap-3 justify-between">
                        <Input
                            id="retentionCalc"
                            label={`${documentForm.taxValue ? "IGV:" : documentForm.retentionValue ? "Retención (8%):" : "Inafecto"}`}
                            onChange={(e) => handleInputChange(e.target.value, "taxRetentionValue")}
                            value={documentForm.taxRetentionValue}
                            typeForm="create"
                            type="number"
                            className="w-2/3 md:w-4/5"
                        />
                        <ToggleButton
                            checked={(documentForm.taxValue || documentForm.retentionValue) ? documentForm.isAffectedTaxRetention : false}
                            onChange={() => {
                                
                                setDocumentForm(prevState => ({
                                    ...prevState,
                                    isAffectedTaxRetention: !prevState.isAffectedTaxRetention,
                                }))
                            }}
                        />
                    </div>
                </div>

                {
                    (orderData.detraction || orderData.perception) &&
                    <div className="col-span-1 col-start-2 col-end-3">
                        <Input
                            id="detractionCalc"
                            label={`Cálculo ${orderData.detraction ? "detracción" : "percepción"}`}
                            onChange={(e) => handleInputChange(e.target.value, "perceptionDetractionValue")}
                            value={documentForm.perceptionDetractionValue}
                            typeForm="create"
                            type="number"
                        />
                    </div>
                }
                <div className="col-span-1 col-start-2 col-end-3">
                    <Input
                        id="fise"
                        label="FISE"
                        onChange={(e) => handleInputChange(e.target.value, "fise")}
                        value={documentForm.fise}
                        typeForm="create"
                        type="number"
                    />
                </div>
                <div className="col-span-1 col-start-2 col-end-3">
                    <Input
                        id="otherPays"
                        label="Otros pagos"
                        onChange={(e) => handleInputChange(e.target.value, "otherPayments")}
                        value={documentForm.otherPayments}
                        typeForm="create"
                        type="number"
                    />
                </div>
                <div className="col-span-1 col-start-2 col-end-3">
                    <div className="font-semibold text-gray-400 text-lg">Total: {formatCurrency(getTotal())}</div>
                </div>
                <div className="col-span-2">
                    <div className="flex flex-row w-full justify-center items-center my-5">
                        <button className="md:w-1/3 w-full text-white bg-[#055CBB] text-xl py-4 px-4 rounded-lg hover:bg-blue-600" type="submit">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
