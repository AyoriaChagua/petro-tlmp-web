import { useState } from "react";
import { DocumentI, OrderWithDocumentsI, ReportResponseI } from "../types/reports";
import { getCurrencySymbol } from "../utils/functions";
import { DocumentLSI, OrderLSI } from "../types/order-document";




export const useOrderDocumentReport = () => {
    const [orderWithDocuments, setOrderWithDocuments] = useState<OrderWithDocumentsI[]>([]);
    const [downloadingStates, setDownloadingStates] = useState<{ [key: string]: boolean }>({});

    const receiveData = (data: OrderWithDocumentsI[] | ReportResponseI[]) => {
        setOrderWithDocuments((data as OrderWithDocumentsI[]));
    };

    const searchCurrencySymbol = (code: string) => {
        return getCurrencySymbol(code);
    };

    const handleClickToCreateDocument = (order: OrderLSI) => {
        localStorage.setItem(`order-document-${order.companyId}-${order.orderTypeId}-${order.period}-${order.correlative}`, JSON.stringify(order));
    };

    const handleClickToCreateDocumentPayment = (document: DocumentLSI) => {
        localStorage.setItem(`order-document-payment-${document.companyId}-${document.orderTypeId}-${document.period}-${document.correlative}`, JSON.stringify(document));
    }

    const findLargePayementList = () => {
        const initialDocument: DocumentI = {
            orderDocumentNumber: "",
            subtotal: 0,
            total: 0,
            cia: "",
            correlative: "",
            period: "",
            orderTypeId: "",
            systemUser: "",
            date: "",
            documentStatus: "",
            annotation: "",
            sunatCode: "",
            retentionCalc: null,
            taxCalc: null,
            invoiceFile: undefined,
        };
       
        return initialDocument;
    }

    return {
        orderWithDocuments,
        downloadingStates,
        setDownloadingStates,
        receiveData,
        searchCurrencySymbol,
        handleClickToCreateDocument,
        handleClickToCreateDocumentPayment,
        findLargePayementList
    }
}