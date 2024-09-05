import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { OrderWithDocumentsI, PettyCashReportResponseI, QueryFieldsI, ReportType } from '../types/reports';
import { useAuth } from '../context/AuthContext';
import { showErrorMessage } from '../utils/alerts';
import { getOrder } from '../api/order/get';
import { getFirstDayOfCurrentMonth } from '../utils/dates';
import { getReport } from '../api/report/get';
import { useSunatDocument } from './useSunatDocument';
import { OptionType } from '../types/common/inputs';
import { convertToOptions } from '../utils/functions';
import { useProvider } from './useProvider';
import { MultiValue, SingleValue } from 'react-select';


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

    const [orderWithDocumenst, setOrderWithDocumenst] = useState<OrderWithDocumentsI[]>([]);
    const [pettyCashReport, setPettyCashReport] = useState<PettyCashReportResponseI[]>([]);
    const [documentTypeOptions, setDocumentTypeOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        (async () => {
            let initialFilter = { ...initialFilterState };
            if (reportType === "general") initialFilter = {
                ...initialFilter,
                orderTypeIds: ["O/C", "O/P", "O/S"]
            } 
            else if(reportType === "pettyCash") initialFilter = {
                ...initialFilter,
                isPettyCash: true
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

    const handleOptionSelection = (option: SingleValue<OptionType> | MultiValue<OptionType>, field: keyof QueryFieldsI) => {
        const singleOption = option as SingleValue<OptionType>;
        setFilters(prevState => ({
            ...prevState,
            [field]: singleOption?.value
        }));
    };

    const loadProviderOptions = async (inputValue: string) => {
        const providers = await debouncedSearchProviders(inputValue);
        return convertToOptions({ data: providers, labelKey: "description", valueKey: "ruc" });
    };


    const searchPurchasingDocuments = () => { };

    const searchPettyCashDocuments = async () => {
        try {
            const data = await getReport.getPettyCash(filters);
            setPettyCashReport(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
            return [];
        }
    };

    const searchOrderDocuments = async () => {
        try {
            console.log(filters)
            const data = await getOrder.filterOrderWithDocuemts(filters);
            console.log(data)
            setOrderWithDocumenst(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
            return [];
        }
    }

    return {
        showFilter,
        filters,
        handleDateRange,
        setShowFilter,
        searchPurchasingDocuments,
        searchPettyCashDocuments,
        searchOrderDocuments,
        orderWithDocumenst,
        pettyCashReport,
        handleInputChange,
        handleInputRange,
        documentTypeOptions,
        handleCheckBox,
        loadProviderOptions,
        handleOptionSelection
    }
}