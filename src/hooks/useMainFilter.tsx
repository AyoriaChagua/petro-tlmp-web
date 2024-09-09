import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { OrderWithDocumentsI, ReportResponseI, QueryFieldsI, ReportType } from '../types/reports';
import { useAuth } from '../context/AuthContext';
import { showErrorMessage } from '../utils/alerts';
import { getOrder } from '../api/order/get';
import { formatDate2, getFirstDayOfCurrentMonth } from '../utils/dates';
import { getReport } from '../api/report/get';
import { useSunatDocument } from './useSunatDocument';
import { OptionType } from '../types/common/inputs';
import { convertToOptions } from '../utils/functions';
import { useProvider } from './useProvider';
import { MultiValue, SingleValue } from 'react-select';
import { exportToExcelGeneralReport } from '../utils/excel/report-order-with-documents';
import { exportToExcelPettyCashReport } from '../utils/excel/report-petty-cash';
import { exportToExcelPurchasingReport } from '../utils/excel/report-purchasing';


export const useMainFilter = (reportType: ReportType) => {
    const { companySelected } = useAuth();
    const { fetchSunatDocuments } = useSunatDocument();
    const { debouncedSearchProviders } = useProvider();

    const initialFilterState: QueryFieldsI = {
        companyId: companySelected?.value ?? "",
        startDate: getFirstDayOfCurrentMonth(),
        endDate: new Date,
    }

    const [showFilter, setShowFilter] = useState(true);
    const [filters, setFilters] = useState<QueryFieldsI>(initialFilterState);

    const [orderWithDocuments, setOrderWithDocuments] = useState<OrderWithDocumentsI[]>([]);
    const [documentReport, setDocumentReport] = useState<ReportResponseI[]>([]);


    const [documentTypeOptions, setDocumentTypeOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        (async () => {
            let initialFilter = { ...initialFilterState };
            if (reportType === "general") {
                initialFilter = {
                    ...initialFilter,
                    orderTypeIds: ["O/C", "O/P", "O/S"]
                }
            }
            else if (reportType === "pettyCash") {
                initialFilter = {
                    ...initialFilter,
                    isPettyCash: true
                }
            }
            setFilters(initialFilter);
            const documentsData = await fetchSunatDocuments();
            documentsData && setDocumentTypeOptions(convertToOptions({
                data: documentsData,
                labelKey: "description",
                valueKey: "documentTypeId"
            }));
        })();
    }, [])

    const handleDateRange = (range: Range) => {
        setFilters(prevState => ({
            ...prevState,
            startDate: range.startDate!,
            endDate: range.endDate!
        }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof QueryFieldsI) => {
        const { value } = event.target;
        setFilters(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleInputRange = (from: number, to: number) => {
        setFilters(prevState => ({
            ...prevState,
            minAmount: from,
            maxAmount: to
        }));
    };

    const handleCheckBox = (orderTypes: string[]) => {
        setFilters(prevState => ({
            ...prevState,
            orderTypeIds: orderTypes
        }));
    };

    const handleOptionSelection = (option: SingleValue<OptionType> | MultiValue<OptionType>, field1: keyof QueryFieldsI, field2?: keyof QueryFieldsI) => {
        const singleOption = option as SingleValue<OptionType>;
        if (field2) {
            setFilters(prevState => ({
                ...prevState,
                [field1]: singleOption?.value,
                [field2]: singleOption?.label
            }));
        } else {
            setFilters(prevState => ({
                ...prevState,
                [field1]: singleOption?.value
            }));
        }
    };

    const loadProviderOptions = async (inputValue: string) => {
        const providers = await debouncedSearchProviders(inputValue);
        return convertToOptions({ data: providers, labelKey: "description", valueKey: "ruc" });
    };


    const searchPurchasingDocuments = () => { };

    const searchDocumentReport = async () => {
        try {
            let filterApply = { ...filters }
            if (reportType === "pettyCash") filterApply = {
                ...filterApply,
                isPettyCash: true
            };
            console.log(filterApply)
            const data = await getReport.getDocuments(filterApply);
            setDocumentReport(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
            return [];
        }
    };

    const searchOrderDocuments = async () => {
        try {
            const data = await getOrder.filterOrderWithDocuments(filters);
            setOrderWithDocuments(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
            return [];
        }
    }

    const handleExport = (data: OrderWithDocumentsI[] | ReportResponseI[]) => {
        if (reportType === "general") {
            if (isOrderWithDocumentsArray(data)) {
                exportToExcelGeneralReport(data, `REPORTE-GENERAL-${companySelected?.label}-${formatDate2(new Date())}`);
            } else {
                showErrorMessage("Tipo de datos incorrecto para el reporte general");
            }
        } else if (reportType === "pettyCash") {
            if (isReportResponseArray(data)) {
                exportToExcelPettyCashReport(data, `REPORTE-CAJA-CHICA-${companySelected?.label}-${formatDate2(new Date())}`);
            } else {
                showErrorMessage("Tipo de datos incorrecto para el reporte de caja chica");
            }
        } else if (reportType === "purchasing") {
            if (isReportResponseArray(data)) {
                exportToExcelPurchasingReport(data, `REPORTE-PROVEEDORES-${companySelected?.label}-${formatDate2(new Date())}`);
            } else {
                showErrorMessage("Tipo de datos incorrecto para el reporte de compras");
            }
        }
    };

    function isOrderWithDocumentsArray(data: any): data is OrderWithDocumentsI[] {
        return Array.isArray(data) && data.length > 0 && 'documents' in data[0];
    }

    function isReportResponseArray(data: any): data is ReportResponseI[] {
        return Array.isArray(data) && data.length > 0 && !('documents' in data[0]);
    }

    const clearFilter = () => {
        window.location.reload();
    };

    const handleBlurInputDocumentNumber = () => {
        setFilters(prevState => ({ ...prevState, orderNumber: filters.orderNumber?.padStart(8, "0") }));
    };

    return {
        showFilter,
        filters,
        handleDateRange,
        setShowFilter,
        searchPurchasingDocuments,
        searchDocumentReport,
        searchOrderDocuments,
        orderWithDocuments,
        documentReport,
        handleInputChange,
        handleInputRange,
        documentTypeOptions,
        handleCheckBox,
        loadProviderOptions,
        handleOptionSelection,
        handleExport,
        clearFilter,
        handleBlurInputDocumentNumber,
    }
}