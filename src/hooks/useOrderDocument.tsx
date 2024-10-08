import { useCallback, useEffect, useState } from "react";
import { DocumentFormI, OrderDocumentRequestCreateI, OrderDocumentRequestI, OrderDocumentResponseI, OrderLSI } from "../types/order-document";
import { initialDocumentForm, initialOrderLSI } from "./initial-states/order-document";
import { useSunatDocument } from "./useSunatDocument";
import { convertToOptions } from "../utils/functions";
import { OptionType } from "../types/common/inputs";
import { getOrderDocument } from "../api/order-document/get";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { MultiValue, SingleValue } from "react-select";
import { useAuth } from "../context/AuthContext";
import { postOrderDocument } from "../api/order-document/post";
import { useProvider } from "./useProvider";
import { detractionOptions, issueTypeOptions, perceptionOptions, taxRetentionOptions } from "../utils/constants";
import { putOrderDocument } from "../api/order-document/put";

interface ParamsToCreate {
    readonly companyId: string;
    readonly orderTypeId: string;
    readonly period: string;
    readonly correlative: string;
    readonly documentNumber: string | null;
}

export const useOrderDocument = ({
    companyId,
    orderTypeId,
    period,
    correlative,
    documentNumber
}: ParamsToCreate) => {
    const { debouncedSearchProviders } = useProvider();

    const { fetchSunatDocuments } = useSunatDocument();
    const { user } = useAuth();

    const [orderData, setOrderData] = useState<OrderLSI>({
        ...initialOrderLSI,
        companyId,
        orderTypeId,
        period,
        correlative
    });

    const [documentForm, setDocumentForm] = useState<DocumentFormI>(initialDocumentForm);
    const [documentTypeOptions, setDocumentTypeOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sunatDocuments = await fetchSunatDocuments();
                const exchangeRate = await getOrderDocument.getExchangeRateInSoles();

                const orderLS = localStorage.getItem(`order-document-${companyId}-${orderTypeId}-${period}-${correlative}`);

                if (orderLS && sunatDocuments && exchangeRate) {
                    const orderParsed = JSON.parse(orderLS);
                    setOrderData(prevState => ({
                        ...prevState,
                        ...orderParsed
                    }));
                    setDocumentTypeOptions(convertToOptions({
                        data: sunatDocuments,
                        labelKey: "description",
                        valueKey: "documentTypeId"
                    }));
                    setDocumentForm(prevState => ({
                        ...prevState,
                        exchangeRate
                    }));
                }
                if (documentNumber && sunatDocuments) {
                    const data = await getOrderDocument.getDocumentById(documentNumber, companyId);
                    setDocumentForm(prevState => ({
                        ...prevState,
                        annotation: data.annotation,
                        biorgeya: data.biorgeya.toString(),
                        chargeDate: data.receiptDate,
                        issueDate: data.issueDate,
                        dueDate: data.dueDate,
                        providerDescription: data.providerDescription || "",
                        providerRuc: data.providerRuc || "",
                        exchangeRate: data.exchangeRate,
                        detractionPercValue: data.detractionPerc?.toString() || "",
                        detractionPercLabel: detractionOptions.find((option) => option.value === data.detractionPerc?.toFixed(2)?.toString())?.label || "",
                        perceptionPercValue: data.perceptionPerc?.toString() || "",
                        perceptionPercLabel: perceptionOptions.find((option) => option.value === data.perceptionPerc?.toFixed(2)?.toString())?.label || "",
                        documentTypeValue: data.documentType || "",
                        documentTypeLabel: data.documentTypeDescription || "",
                        taxValue: data.taxPerc?.toString() || "",
                        taxLabel: taxRetentionOptions.find((option) => option.value === data.taxPerc?.toFixed(2)?.toString())?.label || "",
                        retentionValue: data.retentionPerc?.toString() || "",
                        retentionLabel: taxRetentionOptions.find((option) => option.value === data.retentionPerc?.toFixed(2)?.toString())?.label || "",
                        fise: data.fise?.toString() || "",
                        otherPayments: data.otherPayments?.toString() || "",
                        issueTypeValue: data.issueType || "",
                        issueTypeLabel: issueTypeOptions.find((option) => option.value === data.issueType)?.label || "",
                        orderDocumentNumber: data.orderDocumentNumber,
                        subtotal: data.subtotal.toString(),
                        total: data.total.toString(),
                        taxRetentionValue: data.taxCalc ? data.taxCalc.toString() : data.retentionCalc ? data.retentionCalc.toString() : "",
                        perceptionDetractionValue: data.perceptionCalc ? data.perceptionCalc.toString() : data.detractionCalc ? data.detractionCalc.toString() : "",
                    }));
                }
            } catch (error) {
                showErrorMessage("Error al cargar los datos");
            }
        };
        setDocumentForm(initialDocumentForm);
        fetchData();
    }, [companyId, orderTypeId, period, correlative, documentNumber]);

    useEffect(() => {
        handleOptionSelection({
            label: !documentForm.isAffectedTaxRetention ? "-" : documentForm.documentTypeLabel,
            value: !documentForm.isAffectedTaxRetention ? "-" : documentForm.documentTypeValue,
        }, "documentTypeValue");
    }, [documentForm.isAffectedTaxRetention]);

    useEffect(() => {
        calculateTotal(Number(documentForm.subtotal));
    }, [
        documentForm.perceptionPercValue,
        documentForm.detractionPercValue,
        documentForm.taxValue,
        documentForm.retentionValue,
        documentForm.subtotal,
        documentForm.isAffectedTaxRetention
    ]);

    const calculateTotal = (subtotal: number) => {
        let total = 0;
        let taxRetention = 0;
        let perceptionDetraction = 0;
        const tax = Number(documentForm.taxValue) || 0;
        const retention = Number(documentForm.retentionValue) || 0;
        const detractionPerc = Number(documentForm.detractionPercValue) || 0;
        const perceptionPerc = Number(documentForm.perceptionPercValue) || 0;
        if (tax === 0 && retention === 0) {
            total = subtotal
        } else if (tax === 18.00 && retention === 0 && documentForm.isAffectedTaxRetention) {
            taxRetention = (subtotal * 0.18);
            total = subtotal + taxRetention;
        } else if (tax === 0 && retention === 8.00 && documentForm.isAffectedTaxRetention) {
            taxRetention = (subtotal * 1.08) - subtotal;
            total = subtotal - taxRetention;
        }

        if (perceptionPerc > 0) {
            perceptionDetraction = (total * (perceptionPerc / 100));
            total += perceptionDetraction;
        }

        if (detractionPerc > 0) {
            perceptionDetraction = (total * (detractionPerc / 100));
        }

        setDocumentForm(prevState => ({
            ...prevState,
            total: total.toFixed(2).toString(),
            taxRetentionValue: taxRetention.toFixed(2).toString(),
            perceptionDetractionValue: perceptionDetraction.toFixed(2).toString(),
        }));
    }


    const handleOptionSelection = useCallback((option: SingleValue<OptionType> | MultiValue<OptionType>, field1: keyof DocumentFormI, field2?: keyof DocumentFormI) => {
        const singleOption = option as SingleValue<OptionType>;


        if (field1 === "documentTypeValue" && singleOption?.value === "RH") {
            const retentionValue = "8.00";
            const retentionLabel = "8%";
            setDocumentForm(prevState => ({ ...prevState, taxValue: "", taxLabel: "", retentionValue, retentionLabel }));
        } else if (field1 === "documentTypeValue" && singleOption?.value !== "-") {
            const taxLabel = "18%";
            const taxValue = "18.00";
            setDocumentForm(prevState => ({ ...prevState, taxValue, taxLabel, retentionValue: "", retentionLabel: "" }));
        } else if (field1 === "documentTypeValue") {
            setDocumentForm(prevState => ({ ...prevState, taxValue: "", taxLabel: "", retentionValue: "", retentionLabel: "" }));
            return;
        }

        if (field2) {
            setDocumentForm(prevState => ({ ...prevState, [field1]: singleOption?.value!, [field2]: singleOption?.label }));
        } else {
            setDocumentForm(prevState => ({ ...prevState, [field1]: singleOption?.value! }));
        }
    }, []);

    const handleInputChange = useCallback((value: string | Date, field: keyof DocumentFormI) => {
        setDocumentForm(prevState => ({ ...prevState, [field]: value }));
    }, []);

    const loadProviderOptions = async (inputValue: string) => {
        const providers = await debouncedSearchProviders(inputValue);
        return convertToOptions({ data: providers, labelKey: "description", valueKey: "ruc" });
    };

    const handleBlurInputDocumentNumber = () => {
        const chunks = documentForm.orderDocumentNumber.split("-");
        if (chunks.length === 2) {
            const prefix = chunks[0];
            let suffix = chunks[1].padStart(8, "0");
            setDocumentForm(prevState => ({ ...prevState, orderDocumentNumber: `${prefix}-${suffix}` }));
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const retention = parseInt(documentForm.retentionValue);
            const tax = parseInt(documentForm.taxValue);

            const perception = parseInt(documentForm.perceptionPercValue);
            const detraction = parseInt(documentForm.detractionPercValue);

            let documentRequest: OrderDocumentRequestI | OrderDocumentRequestCreateI = {
                annotation: documentForm.annotation,
                biog: Number(documentForm.subtotal),
                providerRuc: documentForm.providerRuc,
                chargeDate: documentForm.receiptDate,
                companyId,
                orderTypeId,
                period,
                correlative,
                date: documentForm.issueDate,
                dueDate: documentForm.dueDate,
                exchangeRate: Number(documentForm.exchangeRate),
                otherPayments: Boolean(documentForm.otherPayments) ? Number(documentForm.otherPayments) : null,
                fise: Boolean(documentForm.fise) ? Number(documentForm.fise) : null,
                documentStatus: "ACTIVO",
                noOrderFlag: false,
                documentTypeId: documentForm.documentTypeValue,
                subtotal: Number(documentForm.subtotal),
                total: getTotal(),
                typeEmission: documentForm.issueTypeValue,
                systemUser: user?.id!,
                detractionCalc: Boolean(detraction) ? parseFloat(documentForm.perceptionDetractionValue) : null,
                detractionPerc: Boolean(detraction) ? detraction : null,
                perceptionCalc: Boolean(perception) ? parseFloat(documentForm.perceptionDetractionValue) : null,
                perceptionPerc: Boolean(perception) ? perception : null,
                retentionCalc: Boolean(retention) ? parseFloat(documentForm.taxRetentionValue) : null,
                retentionPerc: Boolean(retention) ? retention : null,
                taxCalc: Boolean(tax) ? parseFloat(documentForm.taxRetentionValue) : null,
                taxPerc: Boolean(tax) ? tax : null
            };

            let newDocumentResponse: OrderDocumentResponseI | OrderDocumentRequestCreateI;

            if (documentNumber) {
                newDocumentResponse = await putOrderDocument.updateDocument(documentNumber, companyId, documentRequest);
                if (newDocumentResponse) {
                    showSuccessMessage(`El documento ${documentNumber} fue actualizado exitosamente`);
                    return;
                } else {
                    throw new Error("Error al actualizar el documento");
                }
            } else {
                const createRequest = documentRequest as OrderDocumentRequestCreateI;
                createRequest.orderDocumentNumber = documentForm.orderDocumentNumber;
                newDocumentResponse = await postOrderDocument.createDocumentVoucher(createRequest);
                if (newDocumentResponse) {
                    showSuccessMessage(`El documento ${createRequest.orderDocumentNumber} fue creado exitosamente`);
                    return;
                } else {
                    throw new Error("Error al crear el documento");
                }
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    const getTotal = (): number => {
        const subtotal = parseFloat(documentForm.subtotal);
        const taxRetention = parseFloat(documentForm.taxRetentionValue);
        const perceptionDetraction = parseFloat(documentForm.perceptionDetractionValue);
        const fise = Number(documentForm.fise);
        const otherPayments = Number(documentForm.otherPayments);
        const total = (Boolean(documentForm.taxValue) ? (subtotal + taxRetention) : (subtotal - taxRetention)) + perceptionDetraction + fise + otherPayments;
        return Number.isNaN(total) ? 0 : total;
    }

    return {
        orderData,
        documentForm,
        documentTypeOptions,
        setDocumentForm,
        handleOptionSelection,
        handleInputChange,
        handleBlurInputDocumentNumber,
        onSubmit,
        getTotal,
        loadProviderOptions
    }
}