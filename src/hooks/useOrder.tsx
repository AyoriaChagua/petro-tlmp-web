import { useEffect, useState, useCallback } from "react"
import { initialOrderForm } from "./initial-states/order";
import { OrderDetailRequestI, OrderDetailsFormI, OrderFormI, OrderRequestI } from "../types/order";
import { useProvider } from "./useProvider";
import { useCostCenter } from "./useCostCenter";
import { useRequestingArea } from "./useRequestingArea";
import { useApprovalPersonnel } from "./useApprovalPersonnel";
import { OptionType } from "../types/common/inputs";
import { convertToOptions, getCurrencySymbol } from "../utils/functions";
import { MultiValue, SingleValue } from "react-select";
import { useCorrelativeControl } from "./useCorrelativeControl";
import { shortOrderTypeOptions } from "../utils/constants";
import { ProviderAccount, ProviderMP } from "../types/provider";
import { useAuth } from "../context/AuthContext";
import { postOrder } from "../api/order/post";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";

export const useOrder = () => {
    const { debouncedSearchProviders } = useProvider();
    const { costCenters, fetchCostCenters } = useCostCenter();
    const { requestingAreas } = useRequestingArea();
    const { approvalPersonnel } = useApprovalPersonnel();
    const { correlativeControl, fetchCorrelativeControl } = useCorrelativeControl();
    const { user, companySelected } = useAuth();

    const [orderForm, setOrderForm] = useState<OrderFormI>(initialOrderForm);

    const [costCenterOptions, setCostCenterOptions] = useState<OptionType[]>([]);
    const [providerAccountOptions, setProviderAccountOptions] = useState<OptionType[]>([]);
    const [requestingAreaOptions, setRequestingAreaOptions] = useState<OptionType[]>([]);
    const [approvalPersonnelOptions, setApprovalPersonnelOptions] = useState<OptionType[]>([]);
    const [orderTypeOptions, setOrderTypeOptions] = useState<OptionType[]>([]);

    const [providers, setProviders] = useState<ProviderMP[]>([]);
    const [providerAccounts, setProviderAccounts] = useState<ProviderAccount[]>([]);

    const [isDataReady, setIsDataReady] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState("");


    useEffect(() => {
        if (costCenters.length > 0 && requestingAreas.length > 0 && approvalPersonnel.length > 0 && correlativeControl.length > 0 && !isDataReady) {
            const withCorrelatives = checkCorrelative();
            if (!withCorrelatives) {
                showErrorMessage("No hay correlativos activos");
                return;
            }
            setIsDataReady(true);
        }
    }, [costCenters, requestingAreas, approvalPersonnel, correlativeControl]);
    

    useEffect(() => {
        fetchCostCenters().then(() => setIsDataReady(false));
    }, [companySelected])
    

    useEffect(() => {
        const correlativeC = correlativeControl.find(cc => cc.active && cc.orderTypeId === orderForm.orderTypeId);
        if (correlativeC) {
            setOrderForm(prevState => ({
                ...prevState,
                correlative: correlativeC.correlative,
                orderTypeId: correlativeC.orderTypeId,
                period: correlativeC.period,
                companyId: correlativeC.companyId
            }));
        }
    }, [orderForm.orderTypeId])

    const checkCorrelative = (): boolean => {
        const correlatives = correlativeControl.filter(cc => cc.active);
        if (correlatives.length === 0) {
            return false;
        } else {
            const _orderOptions: OptionType[] = correlatives.map(cc => ({
                label: shortOrderTypeOptions.find(option => option.value === cc.orderTypeId)?.label || "",
                value: cc.orderTypeId
            }));

            setOrderTypeOptions(_orderOptions);

            const correlativeDefault = correlatives[0];
            setOrderForm(prevState => ({ ...prevState, correlative: correlativeDefault.correlative, orderTypeId: correlativeDefault.orderTypeId, period: correlativeDefault.period, companyId: correlativeDefault.companyId }));
        }
        return true;
    }

    useEffect(() => {
        if (isDataReady) {
            setCostCenterOptions(convertToOptions({ data: costCenters, labelKey: "description", valueKey: "id" }));
            setRequestingAreaOptions(convertToOptions({ data: requestingAreas, labelKey: "description", valueKey: "id" }));
            setApprovalPersonnelOptions(convertToOptions({ data: approvalPersonnel, labelKey: "description", valueKey: "id" }));
            handleTaxRetentionSelection({ value: "18.00", label: "IGV 18%" });
        }
    }, [isDataReady]);

    useEffect(() => {
        const providerSelected = providers.find(provider => provider.ruc === orderForm.providerRuc);
        if (providerSelected) {
            setOrderForm(prevState => ({
                ...prevState,
                providerRuc: providerSelected.ruc,
                providerDescription: providerSelected.description,
                providerAddress: providerSelected.address ?? "",
            }));
            const providerAccountOptions = convertToOptions({
                data: providerSelected.accounts,
                labelKey: "accountNumber",
                valueKey: "id"
            });
            setProviderAccountOptions(providerAccountOptions);
            setProviderAccounts(providerSelected.accounts);
        }
    }, [orderForm.providerRuc]);

    useEffect(() => {
        const providerAccount = providerAccounts.find(account => account.id === Number(orderForm.bankAccountId));
        if (providerAccount) {
            setOrderForm(prevState => ({
                ...prevState,
                providerAccountBank: providerAccount.bank,
                providerAccountCCI: providerAccount.cci ?? "",
            }));
        }
    }, [orderForm.bankAccountId]);

    useEffect(() => {
        const subtotal = orderForm.details
            .map(det => (Number(det.quantity) * Number(det.unitPrice)))
            .reduce((a, b) => Number(a) + Number(b), 0);
        calculateTotal(subtotal);
    }, [orderForm.details, orderForm.taxValue, orderForm.retentionValue, orderForm.detractionValue, orderForm.perceptionValue]);

    const calculateTotal = (subtotal: number) => {

        let total: number = 0;

        let taxRetention: number = 0;
        let perceptionDetraction: number = 0;

        const tax = Number(orderForm.taxValue) || 0;
        const retention = Number(orderForm.retentionValue) || 0;

        const detractionPerc = Number(orderForm.detractionValue) || 0;
        const perceptionPerc = Number(orderForm.perceptionValue) || 0;

        if (tax === 0 && retention === 0) {
            total = subtotal
        } else if (tax === 18.00 && retention === 0) {
            taxRetention = (subtotal * 0.18);
            total = subtotal + taxRetention;
        } else if (tax === 0 && retention === 8.00) {
            taxRetention = (subtotal * 1.08) - subtotal
            total = subtotal - taxRetention
        }

        if (perceptionPerc > 0) {
            perceptionDetraction = (total * (perceptionPerc / 100));
            total += perceptionDetraction;
        }

        if (detractionPerc > 0) {
            perceptionDetraction = (total * (detractionPerc / 100));
        }

        setOrderForm(prevState => ({
            ...prevState,
            totalLabel: total.toFixed(2).toString(),
            taxRetentionLabel: taxRetention.toFixed(2).toString(),
            subtotal,
            perceptionDetractionLabel: perceptionDetraction.toFixed(2).toString()
        }));
    };

    const loadProviderOptions = async (inputValue: string) => {
        const providers = await debouncedSearchProviders(inputValue);
        setProviders(providers)
        return convertToOptions({ data: providers, labelKey: "description", valueKey: "ruc" });
    };


    const handleOptionSelection = useCallback((option: SingleValue<OptionType> | MultiValue<OptionType>, field1: keyof OrderFormI, field2?: keyof OrderFormI) => {
        if (Array.isArray(option)) {
            showErrorMessage("Por favor seleccione una sola opción");
            return;
        }

        const singleOption = option as SingleValue<OptionType>;

        if (field1 === "currencyValue") {
            setCurrencySymbol(getCurrencySymbol(singleOption?.value!))
        } else if (field1 === "detractionValue") {
            setOrderForm(prevState => ({ ...prevState, "perceptionValue": "", perceptionLabel: "" }));
        } else if (field1 === "perceptionValue") {
            setOrderForm(prevState => ({ ...prevState, "detractionValue": "", detractionLabel: "" }));
        } else if (field1 === "orderTypeId") {
            setOrderForm(prevState => ({
                ...prevState,
                perceptionLabel: "",
                detractionLabel: "",
                perceptionValue: "",
                detractionValue: "",
            }));
        }

        if (field2) {
            setOrderForm(prevState => ({ ...prevState, [field1]: singleOption?.value, [field2]: singleOption?.label }));
        } else {
            setOrderForm(prevState => ({ ...prevState, [field1]: singleOption?.value }));
        };
    }, []);

    const handleTaxRetentionSelection = useCallback((option: SingleValue<OptionType>) => {
        if (!option) return;

        const updateOrderForm = (updates: Partial<OrderFormI>) => {
            setOrderForm(prevState => ({
                ...prevState,
                isAffectedIGV: false,
                isAffectedIGVLabel: "",
                retentionValue: "",
                retentionLabel: "",
                taxValue: "",
                taxLabel: "",
                ...updates
            }));
        };

        switch (option.value) {
            case "false":
                updateOrderForm({ isAffectedIGV: false, isAffectedIGVLabel: "false" });
                break;
            case "18.00":
                updateOrderForm({ isAffectedIGV: true, taxValue: "18.00", taxLabel: option.label });
                break;
            case "8.00":
                updateOrderForm({ retentionValue: "8.00", retentionLabel: option.label });
                break;
        }
    }, []);

    const handleLineInput = useCallback((value: string, field: keyof OrderDetailsFormI, index: number) => {
        setOrderForm(prevState => ({
            ...prevState,
            details: prevState.details.map((detail, i) => i === index ? {
                ...detail,
                [field]: value,
                subtotal: Number(detail.quantity) * Number(detail.unitPrice)
            } : detail)
        }))
    }, []);

    const handleAddLine = () => {
        setOrderForm(prevState => ({
            ...prevState,
            details: [...prevState.details, initialOrderForm.details[0]]
        }));
    };

    const handleRemoveLine = (index: number) => {
        setOrderForm(prevState => ({
            ...prevState,
            details: prevState.details.filter((_, i) => i !== index)
        }));
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const retention = parseFloat(orderForm.retentionValue);
            const perception = parseFloat(orderForm.perceptionValue);
            const detraction = parseFloat(orderForm.detractionValue);
            const tax = parseFloat(orderForm.taxValue);
            const perceptionDetraccionCalc = parseFloat(orderForm.perceptionDetractionLabel);
            const taxRetentionCalc = parseFloat(orderForm.taxRetentionLabel);
            const newOrder: OrderRequestI = {
                approvingStaffId: Number(orderForm.approverValue),
                automaticSignature: Boolean(orderForm.automaticSignature),
                bankAccountId: Number(orderForm.bankAccountId) || null,
                costCenterId: Number(orderForm.costCenterValue),
                currency: orderForm.currencyValue,
                detraction: detraction || null,
                isAffectedIGV: orderForm.isAffectedIGV,
                orderDate: new Date(orderForm.orderDate),
                orderTypeId: orderForm.orderTypeId,
                paymentMethod: orderForm.paymentMethodValue,
                perception: perception || null,
                providerRuc: orderForm.providerRuc || null,
                retention: retention || null,
                requestingAreaId: Number(orderForm.requestingAreaValue),
                systemUser: user?.id!,
                tax: tax || null,
                total: Number(orderForm.totalLabel),
                companyId: orderForm.companyId,
                correlative: orderForm.correlative,
                detractionCalc: !perception ? perceptionDetraccionCalc : null,
                perceptionCalc: !detraction ? perceptionDetraccionCalc : null,
                observations: orderForm.observations,
                period: orderForm.period,
                retentionCalc: (!tax && taxRetentionCalc > 0) ? taxRetentionCalc : null,
                taxCalc: (!retention && taxRetentionCalc > 0) ? taxRetentionCalc : null,
                subtotal: Number(orderForm.subtotal),
                isPettyCash: orderForm.isPettyCash

            };
            const newDetails: OrderDetailRequestI[] = orderForm.details.map(detail => ({
                ...detail,
                subtotal: Number(detail.quantity) * Number(detail.unitPrice),
                quantity: Number(detail.quantity),
                unitPrice: Number(detail.unitPrice),
                measurement: detail.measurement,
                companyId: orderForm.companyId,
                orderTypeId: orderForm.orderTypeId,
                period: orderForm.period,
                correlative: orderForm.correlative,
                user: user?.id!,
            }));
            const data = await postOrder.createOrder(newOrder);
            if (data) {
                const dataDet = await postOrder.createDetails(newDetails);
                if (dataDet.status === 201) {
                    showSuccessMessage(`Orden #${data.correlative} creada con éxito`);
                    fetchCorrelativeControl();
                }
                else throw new Error("Error al crear los detalles de la orden");
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    return {
        orderForm,
        isDataReady,
        costCenterOptions,
        requestingAreaOptions,
        approvalPersonnelOptions,
        loadProviderOptions,
        providers,
        providerAccountOptions,
        handleOptionSelection,
        setOrderForm,
        correlativeControl,
        orderTypeOptions,
        handleAddLine,
        handleRemoveLine,
        handleLineInput,
        handleTaxRetentionSelection,
        currencySymbol,
        onSubmit
    }
}