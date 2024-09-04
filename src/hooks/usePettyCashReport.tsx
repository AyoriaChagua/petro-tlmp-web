import { useState } from "react"
import { OrderWithDocumentsI, PettyCashReportResponseI } from "../types/reports";

export const usePettyCashReport = () => {
    const [pettyCashReport, setPettyCashReport] = useState<PettyCashReportResponseI[]>([]);

    const receiveData = (data: PettyCashReportResponseI[] | OrderWithDocumentsI[]) => {
        setPettyCashReport((data as PettyCashReportResponseI[]));
    };

    return {
        pettyCashReport,
        receiveData
    }
}