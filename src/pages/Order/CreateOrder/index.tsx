import { BorderedRadio, CustomSelect, IconButton, Input, Loader, RadioGroup, Textarea } from "../../../components"
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
        orderTypeOptions
    } = useOrder();
    if (!isDataReady) return <Loader />
    return (
        <div className="flex flex-col w-full justify-center items-center border-x md:px-4">
            <RadioGroup
                onChange={(option) => handleOptionSelection(option, "orderTypeId")}
                options={orderTypeOptions}
                selectedValue={orderForm.orderTypeId}
            />
            <br />
            <h3 className="text-2xl font-semibold text-[#055CBB]">#{orderForm.correlative}</h3>
            <div className="container mx-auto p-4">
                <form>
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
                                onChange={(option) => handleOptionSelection(option, "currency")}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="paymentMethod"
                                label="Forma de pago"
                                options={paymentMethodOptions}
                                onChange={(option) => handleOptionSelection(option, "paymentMethod")}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="costCenter"
                                label="Centro de costo"
                                options={costCenterOptions}
                                onChange={(option) => handleOptionSelection(option, "costCenter", "costCenterId")}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="requestingArea"
                                label="Área solicitante"
                                options={requestingAreaOptions}
                                onChange={(option) => handleOptionSelection(option, "requestingArea", "requestingAreaId")}
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
                                        onChange={(option) => handleOptionSelection(option, "approver", "approvingStaffId")}
                                        typeForm="create"
                                        placeholder=""
                                    />
                                </div>
                                <div className="col-span-1">
                                    <BorderedRadio
                                        title="Incluye firma?"
                                        name="signature"
                                        onChange={(option) => handleOptionSelection(option, "automaticSignature")}
                                        options={yesOrNoOptions}
                                        selectedValue="false"
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
                                onChange={(option) => handleOptionSelection(option, "tax", "retention")}
                                options={taxRetentionOptions}
                                selectedValue={""}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="perceptionPer"
                                label="Percepción"
                                options={perceptionOptions}
                                onChange={(option) => handleOptionSelection(option, "perception")}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomSelect
                                id="detractionPer"
                                label="Detracción"
                                options={detractionOptions}
                                onChange={(option) => handleOptionSelection(option, "detraction")}
                                typeForm="create"
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* Provider section */}
                    <hr className="mb-4 mt-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="mb-3">
                                <label htmlFor={"selectProvider"} className={"block mb-2 text-sm font-medium text-gray-600"}>RUC/DNI proveedor</label>
                                <AsyncSelect
                                    id="selectProvider"
                                    loadOptions={loadProviderOptions}
                                    onChange={(option) => handleOptionSelection(option, "providerRuc")}
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
                                label={`Cuenta ${orderForm.providerAccountBank ?? ""} de proveedor`}
                                options={providerAccountOptions}
                                onChange={(option) => handleOptionSelection(option, "bankAccountId")}
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
                    {/* Details section */}
                    <hr className="mb-4 mt-3" />
                    <div className="w-full">
                        {/* Encabezados */}
                        <div className="hidden md:flex text-gray-500 font-semibold">
                            <div className="py-2 w-1/5">Producto</div>
                            <div className="px-4 py-2 w-1/5">Cantidad</div>
                            <div className="px-4 py-2 w-1/5">Unidad de Medida</div>
                            <div className="px-4 py-2 w-1/5">Precio Unitario</div>
                            <div className="px-4 py-2 w-1/5">Subtotal</div>
                        </div>

                        {/* Fila de datos */}
                        <div className="flex flex-wrap md:flex-nowrap border-b py-1">
                            <div className="py-1 w-full md:w-1/5">
                                <textarea className="w-full p-2" placeholder="Producto" />
                            </div>
                            <div className="px-4 py-1 w-full md:w-1/5">
                                <input type="number" className="w-full p-2" placeholder="Cantidad" />
                            </div>
                            <div className="px-4 py-1 w-full md:w-1/5">
                                <input type="text" className="w-full p-2" placeholder="Unidad" />
                            </div>
                            <div className="px-4 py-1 w-full md:w-1/5">
                                <input type="number" className="w-full p-2" placeholder="Precio" />
                            </div>
                            <div className="relative px-4 py-1 w-full md:w-1/5 bg-transparent">
                                <input type="number" className="w-full p-2" placeholder="Subtotal" readOnly />
                                <div className="absolute top-1/2 -right-3 md:-right-12 transform -translate-y-1/2 z-50">
                                    <IconButton icon="minus" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-10 flex  items-center gap-2">
                        <IconButton
                            icon="plus"
                        />
                        <span className="font-semibold text-blue-700">Agregar linea</span>
                    </div>
                    <div className="flex float-end flex-col md:w-1/3 w-full p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="max-w-sm overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between text-gray-400 pb-2 mb-2">
                                    <span className="font-medium">Subtotal:</span>
                                    <span className="font-medium">100</span>
                                </div>
                                <div className="flex justify-between text-gray-400  pb-2 mb-2">
                                    <span className="font-medium">IGV/Retención:</span>
                                    <span className="font-medium">1000</span>
                                </div>
                                <div className="flex justify-between text-gray-400 pb-2 mb-2">
                                    <span className="font-medium">Percepción:</span>
                                    <span className="font-medium">180</span>
                                </div>
                                <div className="flex justify-between text-gray-400 pb-2 mb-2">
                                    <span className="font-medium">Detracción:</span>
                                    <span className="font-medium">180</span>
                                </div>
                                <div className="border-t  pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg text-gray-400">
                                        <span>Total a Pagar:</span>
                                        <span>1000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full mt-3">
                        <Textarea
                            id="observations"
                            label="Observaciones"
                            onChange={() => { }}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
