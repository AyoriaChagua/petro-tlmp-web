import { useEffect, useState, useCallback } from "react"
import { initialOrderForm } from "./initial-states/order";
import { OrderFormI } from "../types/order";
import { useProvider } from "./useProvider";
import { useCostCenter } from "./useCostCenter";
import { useRequestingArea } from "./useRequestingArea";
import { useApprovalPersonnel } from "./useApprovalPersonnel";
import { OptionType } from "../types/common/inputs";
import { convertToOptions, showErrorMessage } from "../utils/functions";
import { MultiValue, SingleValue } from "react-select";
import { useCorrelativeControl } from "./useCorrelativeControl";
import { shortOrderTypeOptions } from "../utils/constants";

export const useOrder = () => {
    const { providers, debouncedSearchProviders } = useProvider();
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
        }
    }, [isDataReady]);


    const loadProviderOptions = async (inputValue: string) => {
        const providers = await debouncedSearchProviders(inputValue);
        return convertToOptions({ data: providers, labelKey: "description", valueKey: "ruc" });
    };


    const handleOptionSelection = useCallback((option: SingleValue<OptionType> | MultiValue<OptionType>, field1: keyof OrderFormI, field2?: keyof OrderFormI) => {
        if (Array.isArray(option)) {
            showErrorMessage("Por favor seleccione una sola opción");
            return;
        }

        // Esto es una asersión de tipo 🤯
        const singleOption = option as SingleValue<OptionType>;

        if (field2) {
            setOrderForm(prevState => ({ ...prevState, [field1]: singleOption?.value, [field2]: singleOption?.label }));
        } else {
            setOrderForm(prevState => ({ ...prevState, [field1]: singleOption?.value }));
        }
    }, []);

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
        orderTypeOptions
    }
}