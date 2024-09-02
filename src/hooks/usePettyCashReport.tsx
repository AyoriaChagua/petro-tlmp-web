import { useState } from "react"
import { DocumentReportResponseI, OrderWithDocumentsI } from "../types/reports";

export const usePettyCashReport = () => {
    const [pettyCashReport, setPettyCashReport] = useState<DocumentReportResponseI[]>([]);

    const receiveData = (data: DocumentReportResponseI[] | OrderWithDocumentsI[]) => {
        setPettyCashReport((data as DocumentReportResponseI[]));
    };

    return {
        pettyCashReport,
        receiveData
    }
}