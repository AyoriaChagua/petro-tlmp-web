import { useEffect, useState, useCallback } from "react"
import { initialOrderForm } from "./initial-states/order";
import { OrderDetailsFormI, OrderFormI } from "../types/order";
import { useProvider } from "./useProvider";
import { useCostCenter } from "./useCostCenter";
import { useRequestingArea } from "./useRequestingArea";
import { useApprovalPersonnel } from "./useApprovalPersonnel";
import { OptionType } from "../types/common/inputs";
import { convertToOptions, showErrorMessage } from "../utils/functions";
import { MultiValue, SingleValue } from "react-select";
import { useCorrelativeControl } from "./useCorrelativeControl";
import { shortOrderTypeOptions } from "../utils/constants";
import { ProviderAccount, ProviderMP } from "../types/provider";

export const useOrder = () => {
    const { debouncedSearchProviders } = useProvider();
    const { costCenters } = useCostCenter();
    const { requestingAreas } = useRequestingArea();
    const { approvalPersonnel } = useApprovalPersonnel();
    const { correlativeControl } = useCorrelativeControl();

    const [orderForm, setOrderForm] = useState<OrderFormI>(initialOrderForm);

    const [costCenterOptions, setCostCenterOptions] = useState<OptionType[]>([]);
    const [providerAccountOptions, setProviderAccountOptions] = useState<OptionType[]>([]);
    const [requestingAreaOptions, setRequestingAreaOptions] = useState<OptionType[]>([]);
    const [approvalPersonnelOptions, setApprovalPersonnelOptions] = useState<OptionType[]>([]);
    const [orderTypeOptions, setOrderTypeOptions] = useState<OptionType[]>([]);

    const [providers, setProviders] = useState<ProviderMP[]>([]);
    const [providerAccounts, setProviderAccounts] = useState<ProviderAccount[]>([]);

    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        if (costCenters.length > 0 && requestingAreas.length > 0 && approvalPersonnel.length > 0 && correlativeControl.length > 0) {
            const withCorrelatives = checkCorrelative();
            if (!withCorrelatives) {
                showErrorMessage("No hay correlativos activos");
                return;
            }
            setIsDataReady(true);
        }
    }, [costCenters, requestingAreas, approvalPersonnel, correlativeControl]);

    useEffect(() => {
        const correlativeC = correlativeControl.find(cc => cc.active && cc.orderTypeId === orderForm.orderTypeId);
        if (correlativeC) {
            setOrderForm(prevState => ({ ...prevState, correlative: correlativeC.correlative, orderTypeId: correlativeC.orderTypeId, period: correlativeC.period, companyId: correlativeC.companyId }));
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

        const tax = Number(orderForm.taxValue) || 0;
        const retention = Number(orderForm.retentionValue) || 0;

        if (tax === 0 && retention === 0) {
            total = subtotal
        } else if(tax === 18.00 && retention === 0){
            taxRetention = (subtotal * 0.18);
            total = subtotal + taxRetention;
        } else if(tax === 0 && retention === 8.00){
            taxRetention = (subtotal * 1.08) - subtotal
            total = subtotal - taxRetention
        }
        setOrderForm(prevState => ({ ...prevState, totalLabel: total.toFixed(2).toString(), taxRetentionLabel: taxRetention.toFixed(2).toString(), subtotal }));
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

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(orderForm);
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
        onSubmit
    }
}