import { useState } from "react"
import { OrderWithDocumentsI, ReportResponseI } from "../types/reports";

export const useDocumentReport = () => {
    const [documentReport, setDocumentReport] = useState<ReportResponseI[]>([]);

    const receiveData = (data: ReportResponseI[] | OrderWithDocumentsI[]) => {
        setDocumentReport((data as ReportResponseI[]));
    };

    return {
        documentReport,
        receiveData
    }
}