import { useCallback, useEffect, useState } from 'react';
import { Range } from 'react-date-range';
import { OrderWithDocumentsI, QueryFieldsI, ReportType } from '../types/reports';
import { useAuth } from '../context/AuthContext';
import { showErrorMessage } from '../utils/alerts';
import { getOrder } from '../api/order/get';
import { getFirstDayOfCurrentMonth } from '../utils/dates';


export const useMainFilter = (reportType: ReportType) => {
    const { companySelected } = useAuth();

    const initialFilterState = {
        companyId: companySelected?.value || "",
        startDate: getFirstDayOfCurrentMonth(),
        endDate: new Date,
    }

    const [showFilter, setShowFilter] = useState(true);
    const [filters, setFilters] = useState<QueryFieldsI>(initialFilterState);
    const [orderWithDocumenst, setoOrderWithDocumenst] = useState<OrderWithDocumentsI[]>([]);

    useEffect(() => {
        setFilters(initialFilterState)
    }, [])

    const handleDateRange = (range: Range) => {
        setFilters(prevState => ({
            ...prevState,
            startDate: range.startDate!,
            endDate: range.endDate!
        }));
    };

    const searchPurchasingDocuments = () => { };

    const searchPettyCashDocuments = () => { };

    const searchOrderDocuments = useCallback(async () => { 
        try {
            const data = await getOrder.filterOrderWithDocuemts(filters);
            console.log(data)
            setoOrderWithDocumenst(data);
            return data;
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }, []);

    return {
        showFilter,
        filters,
        handleDateRange,
        setShowFilter,
        searchPurchasingDocuments,
        searchPettyCashDocuments,
        searchOrderDocuments,
        orderWithDocumenst
    }
}