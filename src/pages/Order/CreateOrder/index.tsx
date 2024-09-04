import { BorderedRadio, CustomSelect, IconButton, Input, Loader, RadioGroup, Textarea, ToggleButton } from "../../../components"
import { useOrder } from "../../../hooks/useOrder"
import { currencyOptions, detractionOptions, paymentMethodOptions, perceptionOptions, taxRetentionOptions, yesOrNoOptions } from "../../../utils/constants";
import AsyncSelect from 'react-select/async';


export default function CreateOrder() {
    const {
        costCenterOptions,
        requestingAreaOptions,
        approvalPersonnelOptions,
        orderForm,
        isDataReady,
        providerAccountOptions,
        loadProviderOptions,
        handleOptionSelection,
        setOrderForm,
        orderTypeOptions,
        handleRemoveLine,
        handleAddLine,
        handleLineInput,
        handleTaxRetentionSelection,
        currencySymbol,
        onSubmit
    } = useOrder();

    if (!isDataReady) return <Loader />

    return (
        <div className="flex flex-col w-full justify-center items-center border-x md:px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-start-1 md:col-end-3">
                    <div className="flex justify-center md:float-end ">
                        <RadioGroup
                            onChange={(option) => handleOptionSelection(option, "orderTypeId")}
                            options={orderTypeOptions}
                            selectedValue={orderForm.orderTypeId}
                        />
                    </div>
                </div>
                <div className="md:col-start-3 md:col-end-4">
                    <div className="flex justify-center md:float-end">
                        <ToggleButton
                            checked={orderForm.isPettyCash}
                            onChange={() => setOrderForm(prevState => ({
                                ...prevState,
                                isPettyCash: !prevState.isPettyCash
                            }))}
                            name="Caja chica"
                        />
                    </div>
                </div>
            </div>


            <br />
            <h3 className="text-2xl font-semibold text-[#055CBB]">#{orderForm.correlative}</h3>
            <div className="container mx-auto p-4">
                <form onSubmit={onSubmit}>
                    {/* Main details  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Input
                                id="orderDate"
                                label="Fecha de orden"
                                typeForm="create"
                                type="date"
                                value={orderForm.orderDate}
                                onChange={(e) => setOrderForm(prevState => ({ ...prevState, orderDate: e.target.value }))}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="currency"
                                label="Moneda"
                                options={currencyOptions}
                                onChange={(option) => handleOptionSelection(option, "currencyValue", "currencyLabel")}
                                value={orderForm.paymentMethodValue ? {
                                    label: orderForm.currencyLabel,
                                    value: orderForm.currencyValue
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                                isRequired={true}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="paymentMethod"
                                label="Forma de pago"
                                options={paymentMethodOptions}
                                onChange={(option) => handleOptionSelection(option, "paymentMethodValue", "paymentMethodLabel")}
                                value={orderForm.paymentMethodValue ? {
                                    label: orderForm.paymentMethodLabel,
                                    value: orderForm.paymentMethodValue
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                                isRequired={true}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="costCenter"
                                label="Centro de costo"
                                options={costCenterOptions}
                                onChange={(option) => handleOptionSelection(option, "costCenterValue", "costCenterLabel")}
                                value={orderForm.costCenterValue ? {
                                    label: orderForm.costCenterLabel,
                                    value: orderForm.costCenterValue
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                                isRequired={true}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="requestingArea"
                                label="Área solicitante"
                                options={requestingAreaOptions}
                                onChange={(option) => handleOptionSelection(option, "requestingAreaValue", "requestingAreaLabel")}
                                value={orderForm.requestingAreaValue ? {
                                    label: orderForm.requestingAreaLabel,
                                    value: orderForm.requestingAreaValue
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <CustomSelect
                                        id="approvel"
                                        label="Aprovador"
                                        options={approvalPersonnelOptions}
                                        onChange={(option) => handleOptionSelection(option, "approverValue", "approverLabel")}
                                        value={orderForm.approverValue ? {
                                            label: orderForm.approverLabel,
                                            value: orderForm.approverValue
                                        } : undefined}
                                        typeForm="create"
                                        placeholder=""
                                        isRequired={true}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <BorderedRadio
                                        title="Incluye firma?"
                                        name="signature"
                                        onChange={(option) => handleOptionSelection(option, "automaticSignature")}
                                        options={yesOrNoOptions}
                                        selectedValue={String(orderForm.automaticSignature)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mb-4 mt-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <BorderedRadio
                                title="Impuesto - Retención"
                                name="tax-retention"
                                onChange={handleTaxRetentionSelection}
                                options={taxRetentionOptions}
                                selectedValue={orderForm.taxValue || orderForm.retentionValue || orderForm.isAffectedIGVLabel}
                            />
                        </div>
                        {
                            orderForm.orderTypeId === "O/S" ?
                                <div className="col-span-1">
                                    <div className="hidden">{orderForm.detractionLabel + " " + orderForm.detractionValue}</div>
                                    <CustomSelect
                                        id="detractionPer"
                                        label="Detracción"
                                        options={detractionOptions}
                                        onChange={(option) => handleOptionSelection(option, "detractionValue", "detractionLabel")}
                                        value={(orderForm.orderTypeId === "O/S" || !orderForm.detractionValue) ? undefined : {
                                            label: orderForm.detractionLabel,
                                            value: orderForm.detractionValue
                                        }}
                                        typeForm="create"
                                        placeholder=""
                                    />
                                </div> :
                                <div className="col-span-1">
                                    <CustomSelect
                                        id="perceptionPer"
                                        label="Percepción"
                                        options={perceptionOptions}
                                        onChange={(option) => handleOptionSelection(option, "perceptionValue", "perceptionLabel")}
                                        value={(orderForm.orderTypeId !== "O/S" || !orderForm.perceptionValue) ? undefined : {
                                            label: orderForm.perceptionLabel,
                                            value: orderForm.perceptionValue
                                        }}
                                        typeForm="create"
                                        placeholder=""
                                    />
                                </div>
                        }

                    </div>

                    {/* Provider section */}
                    <hr className="mb-4 mt-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="mb-3">
                                <label htmlFor={"selectProvider"} className={"block mb-2 text-sm font-medium text-gray-600"}>RUC/DNI proveedor</label>
                                <AsyncSelect
                                    id="selectProvider"
                                    placeholder="Buscar..."
                                    loadOptions={loadProviderOptions}
                                    onChange={(option) => handleOptionSelection(option, "providerRuc")}
                                    value={orderForm.providerRuc ? {
                                        label: orderForm.providerRuc,
                                        value: orderForm.providerRuc
                                    } : undefined}
                                    cacheOptions
                                    defaultOptions
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <Input
                                id="providerDescription"
                                label="Descripción de proveedor"
                                typeForm="create"
                                value={orderForm.providerDescription}
                                disabled
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Input
                                id="providerAddress"
                                label="Dirección de proveedor"
                                typeForm="create"
                                value={orderForm.providerAddress}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="providerAccount"
                                label={`Cuenta de banco ${orderForm.providerAccountBank ?? ""} del proveedor`}
                                options={providerAccountOptions}
                                onChange={(option) => handleOptionSelection(option, "bankAccountId", "providerAccountNumber")}
                                value={orderForm.bankAccountId ? {
                                    label: orderForm.providerAccountNumber,
                                    value: orderForm.providerAccountNumber
                                } : undefined}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <Input
                                id="numberCCI"
                                label="Nro. CCI de proveedor"
                                typeForm="create"
                                value={orderForm.providerAccountCCI}
                                disabled
                            />
                        </div>
                    </div>
                    <hr className="mb-4 mt-3" />
                    <div className="w-full">
                        <div className="hidden md:flex text-gray-500 font-semibold">
                            <div className="py-2 w-2/6">Producto</div>
                            <div className="px-4 py-2 w-1/6">Unidad de Medida</div>
                            <div className="px-4 py-2 w-1/6">Cantidad</div>
                            <div className="px-4 py-2 w-1/6">Precio Unitario</div>
                            <div className="px-4 py-2 w-1/6">Subtotal</div>
                        </div>
                        {orderForm.details.map((detail, index) => (
                            <div className="flex flex-wrap md:flex-nowrap border-b py-1" key={"row_" + index}>
                                <div className="py-1 w-full md:w-2/6">
                                    <textarea
                                        className="w-full p-2"
                                        placeholder={`Producto ${index + 1}`}
                                        value={detail.product}
                                        required
                                        onChange={(e) => handleLineInput(e.target.value.toUpperCase(), "product", index)}
                                    />
                                </div>

                                <div className="px-4 py-1 w-full md:w-1/6">
                                    <input
                                        type="text"
                                        className="w-full p-2"
                                        placeholder="Unidad"
                                        value={detail.measurement}
                                        onChange={(e) => handleLineInput(e.target.value.toUpperCase(), "measurement", index)}
                                    />
                                </div>
                                <div className="px-4 py-1 w-full md:w-1/6">
                                    <input
                                        type="number"
                                        className="w-full p-2"
                                        placeholder="Cantidad"
                                        value={detail.quantity}
                                        required
                                        onChange={(e) => handleLineInput(e.target.value.toUpperCase(), "quantity", index)}
                                    />
                                </div>
                                <div className="px-4 py-1 w-full md:w-1/6">
                                    <input
                                        type="number"
                                        className="w-full p-2"
                                        placeholder="Precio"
                                        value={detail.unitPrice}
                                        required
                                        onChange={(e) => handleLineInput(e.target.value, "unitPrice", index)}
                                    />
                                </div>
                                <div className="relative px-4 py-1 w-full md:w-1/6 bg-transparent">
                                    <input
                                        type="number"
                                        className="w-full p-2"
                                        placeholder="Subtotal"
                                        value={detail.quantity * detail.unitPrice}
                                        readOnly
                                    />
                                    {index !== 0 && (
                                        <div className="absolute top-1/2 -right-3 md:-right-12 transform -translate-y-1/2 ">
                                            <IconButton
                                                icon="minus"
                                                onClick={() => handleRemoveLine(index)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="my-10 flex  items-center gap-2">
                        <IconButton
                            icon="plus"
                            onClick={handleAddLine}
                        />
                        <span className="font-semibold text-blue-700">Agregar linea</span>
                    </div>
                    <div className="flex float-end flex-col md:w-1/3 w-full p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="max-w-sm overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between text-gray-400 pb-2 mb-2">
                                    <span className="font-medium">Subtotal:</span>
                                    <span className="font-medium">{currencySymbol} {orderForm.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-400  pb-2 mb-2">
                                    <span className="font-medium">{orderForm.taxValue ? "IGV:" : orderForm.retentionValue ? "Retención (8%):" : "-"}</span>
                                    <span className="font-medium">{currencySymbol} {orderForm.taxRetentionLabel}</span>
                                </div>
                                {orderForm.detractionValue && (
                                    <div className="flex justify-between text-gray-400 pb-2 mb-2">
                                        <span className="font-medium">Detracción:</span>
                                        <span className="font-medium">{orderForm.perceptionDetractionLabel}</span>
                                    </div>
                                )}
                                <div className="border-t  pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg text-gray-400">
                                        <span>Total:</span>
                                        <span>{currencySymbol} {orderForm.totalLabel}</span>
                                    </div>
                                </div>
                                {orderForm.perceptionValue && (
                                    <div className="mt-2 flex justify-between text-gray-400">
                                        <span className="font-semibold">Percepción:</span>
                                        <span className="font-semibold">{orderForm.perceptionDetractionLabel}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full mt-3">
                        <Textarea
                            id="observations"
                            label="Observaciones"
                            value={orderForm.observations}
                            onChange={(e) => setOrderForm(prevState => ({ ...prevState, observations: e.target.value.toUpperCase() }))}
                        />
                    </div>
                    <div className="flex flex-row w-full justify-center items-center my-5">
                        <button className="md:w-1/3 w-full text-white bg-[#055CBB] text-xl py-4 px-4 rounded-lg hover:bg-blue-600" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
