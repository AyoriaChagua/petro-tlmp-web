import Exceljs from 'exceljs';
import { ReportResponseI } from "../../types/reports";
import { showErrorMessage } from "../alerts";
import { formatDateForInput } from '../dates';
import { getCurrencySymbol } from '../functions';
import { formatCurrency, splitVoucher } from '../formats';

export const exportToExcelPettyCashReport = async (
    data: ReportResponseI[],
    fileName: string
) => {
    try {
        const wb = new Exceljs.Workbook();
        const ws = wb.addWorksheet('CAJA CHICA');

        const headers = [
            'N° orden', 'Fecha', 'Moneda', 'Monto debe', 'T. cambio', 'Doc.', 'Num. Doc.', 'Fec. Doc.',
            'Cod. prov. clie.', 'Fec. Ven.', 'C. Costo', 'Glosa', 'Ruc', 'R. Social'
        ];

        const headerRow = ws.addRow(headers);

        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };


        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F0F0F0' },
            bgColor: { argb: 'F0F0F0' }
        };

        data.forEach((order) => {
            const row = ws.addRow([
                order.correlative,
                formatDateForInput(order.date),
                getCurrencySymbol(order.currency),
                formatCurrency(order.total),
                order.exchangeRate,
                splitVoucher(order.orderDocumentNumber)[0],
                splitVoucher(order.orderDocumentNumber)[1],
                order.chargeDate ? formatDateForInput(order.chargeDate) : '',
                order.providerRuc,
                order.dueDate ? formatDateForInput(order.dueDate) : '',
                order.costCenterAlias || order.costCenterId,
                order.annotation,
                order.providerRuc,
                order.providerDescription
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
            'G': 20,
            'H': 20,
            'I': 20,
            'J': 20,
            'K': 15,
            'L': 50,
            'M': 20,
            'N': 40,
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