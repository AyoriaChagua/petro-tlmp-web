import { useState } from "react";
import { OrderWithDocumentsI } from "../types/reports";
import { getCurrencySymbol } from "../utils/functions";
import { OrderLSI } from "../types/order-document";




export const useOrderDocumentReport = () => {
    const [orderWithDocuments, setOrderWithDocuments] = useState<OrderWithDocumentsI[]>([]);
    const receiveData = (data: OrderWithDocumentsI[]) => {
        setOrderWithDocuments(data);
    };

    const searchCurrencySymbol = (code: string) => {
        return getCurrencySymbol(code);
    };

    const handleClickToCreateDocument = (order: OrderLSI) => {
        localStorage.setItem(`order-document-${order.companyId}-${order.orderTypeId}-${order.period}-${order.correlative}`, JSON.stringify(order));
    };

    return {
        orderWithDocuments,
        receiveData,
        searchCurrencySymbol,
        handleClickToCreateDocument
    }
}