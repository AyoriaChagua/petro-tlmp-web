import Exceljs from 'exceljs';
import { ReportResponseI } from "../../types/reports";
import { showErrorMessage } from "../alerts";
import { formatDateForInput } from '../dates';
import { getCurrencySymbol } from '../functions';
import { formatCurrency, splitVoucher } from '../formats';

export const exportToExcelPurchasingReport = async (
    data: ReportResponseI[],
    fileName: string
) => {
    try {
        const wb = new Exceljs.Workbook();
        const ws = wb.addWorksheet('CAJA CHICA');

        const headers = [
            'N° orden', 'Fecha', 'Doc.', 'Num. Doc.', 
            'Fec. Doc.', 'Fec. Venc.', 'Prov.', 'Cod. Prov.', 'B.I.O.G y E.', 'Moneda', 'Total', 'IGV', 'Glosa', 'C. Costo', 'Comentarios', 'Emisión'];

        const headerRow = ws.addRow(headers);

        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };


        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F0F0F0' },
            bgColor: { argb: 'F0F0F0' }
        };

        data.forEach((document) => {
            const row = ws.addRow([
                document.correlative,
                formatDateForInput(document.date),
                splitVoucher(document.orderDocumentNumber)[0],
                splitVoucher(document.orderDocumentNumber)[1],
                document.date ? formatDateForInput(document.date) : '',
                document.dueDate ? formatDateForInput(document.dueDate) : '',
                document.providerDescription,
                document.providerRuc,
                document.biog,
                getCurrencySymbol(document.currency),
                formatCurrency(document.total),
                formatCurrency(document.taxCalc ? document.taxCalc  : document.retentionCalc ? document.retentionCalc : 0),
                document.annotation,
                document.costCenterAlias || document.costCenterId,
                document.observations,
                document.typeEmission
            ]);
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        const columnWidths: { [key: string]: number } = {
            'A': 15,
            'B': 15,
            'C': 15,
            'D': 15,
            'E': 20,
            'F': 20,
            'G': 35,
            'H': 20,
            'I': 20,
            'J': 15,
            'K': 20,
            'L': 20,
            'M': 60,
            'N': 20,
            'O': 60,
            'P': 20,
        };
        
        ws.columns.forEach((column, index) => {
            const columnLetter = String.fromCharCode(65 + index);
            if (columnWidths[columnLetter]) {
                column.width = columnWidths[columnLetter];
            } else {
                column.width = 15;
            }
        });

        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        showErrorMessage("Error al generar el report de Caja chica, " + (error as Error).message);
    }
}