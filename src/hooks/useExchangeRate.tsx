import { useEffect, useState } from "react";
import { initialPaginationOptions } from "./initial-states/general";
import { ExchangeRateResponseI } from "../types/exchange-rate";
import { getExchangeRate } from "../api/exchange-rate/get";
import { showErrorMessage } from "../utils/alerts";

export const useExchangeRate = () => {
    const [paginationOptions, setPaginationOptions] = useState(initialPaginationOptions);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRateResponseI[]>([]);

    const handlePageChange = (page: number) => {
        setPaginationOptions(prevState => ({
            ...prevState,
            currentPage: page
        }));
    }

    const fetchExchangeRates = async (page = 1, limit = 10) => {
        try {
            const response = await getExchangeRate.all(page, limit);
            setExchangeRates(response);
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    const changeItemsPerPage = (newItemsPerPage: number) => {
        if (newItemsPerPage !== paginationOptions.itemsPerPage) {
            setPaginationOptions(prevState => ({
                ...prevState,
                itemsPerPage: newItemsPerPage,
                currentPage: 1
            }));
        }
    };

    useEffect(() => {
        fetchExchangeRates();
        (async () => {
            const totalExchanges = await getExchangeRate.totalNumber();
            const totalPages = Math.ceil(totalExchanges / paginationOptions.itemsPerPage);
            if (totalPages !== paginationOptions.totalPages) {
                setPaginationOptions(prevState => ({
                    ...prevState,
                    totalPages
                }));
            }
        })()
    }, [])


    useEffect(() => {
        fetchExchangeRates(paginationOptions.currentPage, paginationOptions.itemsPerPage);
    }, [paginationOptions.itemsPerPage, paginationOptions.currentPage]);

    return { paginationOptions, handlePageChange, changeItemsPerPage, exchangeRates };
}