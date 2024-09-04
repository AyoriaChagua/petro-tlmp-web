import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { OrderWithDocumentsI, PettyCashReportResponseI, QueryFieldsI } from '../types/reports';
import { useAuth } from '../context/AuthContext';
import { showErrorMessage } from '../utils/alerts';
import { getOrder } from '../api/order/get';
import { getFirstDayOfCurrentMonth } from '../utils/dates';
import { getReport } from '../api/report/get';
import { useSunatDocument } from './useSunatDocument';
import { OptionType } from '../types/common/inputs';
import { convertToOptions } from '../utils/functions';


export const useMainFilter = () => {
    const { companySelected } = useAuth();
    const { fetchSunatDocuments } = useSunatDocument();

    const initialFilterState = {
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
            setFilters(initialFilterState);
            const documentsData = await fetchSunatDocuments();
            documentsData && setDocumentTypeOptions(convertToOptions({
                data: documentsData,
                labelKey: "description",
                valueKey: "documentTypeId"
            }));
        })();
    }, [])

    const handleDateRange = (range: Range) => {
        console.log({
            startDate: range.startDate!,
            endDate: range.endDate!
        })

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
    }

    const handleInputRange = (from: number, to: number) => {
        setFilters(prevState => ({
            ...prevState,
            minAmount: from,
            maxAmount: to
        }));
    }

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
        documentTypeOptions
    }
}