import { useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { OrderWithDocumentsI, QueryFieldsI, ReportType } from '../types/reports';
import { useAuth } from '../context/AuthContext';
import { showErrorMessage } from '../utils/alerts';
import { getOrder } from '../api/order/get';
import { getFirstDayOfCurrentMonth } from '../utils/dates';


export const useMainFilter = (reportType: ReportType) => {
    console.log(reportType)
    const { companySelected } = useAuth();

    const initialFilterState = {
        companyId: companySelected?.value ?? "",
        startDate: getFirstDayOfCurrentMonth(),
        endDate: new Date,
    }

    const [showFilter, setShowFilter] = useState(true);
    const [filters, setFilters] = useState<QueryFieldsI>(initialFilterState);
    const [orderWithDocumenst, setOrderWithDocumenst] = useState<OrderWithDocumentsI[]>([]);

    useEffect(() => {
        setFilters(initialFilterState)
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

    const searchPurchasingDocuments = () => { };

    const searchPettyCashDocuments = () => { };

    const searchOrderDocuments =async () => {
        try {
            console.log(filters)
            const data = await getOrder.filterOrderWithDocuemts(filters);
            console.log(data)
            setOrderWithDocumenst(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
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
    }
}