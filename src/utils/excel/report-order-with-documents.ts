import Exceljs from 'exceljs';
import { OrderWithDocumentsI, DocumentI, PaymentI } from '../../types/reports';
import { formatCurrency } from '../formats';
import { formatDate1, formatDateForInput } from '../dates';
import { getCurrencySymbol } from '../functions';

export const exportToExcel = async (
    data: OrderWithDocumentsI[],
    fileName: string,
) => {
    try {
        const wb = new Exceljs.Workbook();
        const ws = wb.addWorksheet('ÓRDENES CON DOCUMENTOS');

        const headers = [
            'CIA', 'Correlativo', 'Tipo de Orden', 'Periodo', 'Usuario', 'Fecha', 'Observaciones',
            'RUC Proveedor', 'Proveedor', 'Centro de Costo',
            'Afecto IGV', 'Moneda', 'Total', 'Impuesto', 'Percepción/Detracción', 'Productos',
            'N° Documento', 'Subtotal Doc', 'Total Doc', 'Estado Doc', 'Glosa',
            'Código SUNAT', 'Impuesto',
            'Fecha Pago', 'Monto Pagado'
        ];

        const headerRow = ws.addRow(headers);

        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };


        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F0F0F0' },
            bgColor: { argb: 'F0F0F0' }
        }

        const addOrderRow = (
            order: OrderWithDocumentsI,
            doc: DocumentI | null = null,
            payment: PaymentI | null = null
        ) => {
            const row = ws.addRow([
                order.companyId,
                order.correlative,
                order.orderTypeId,
                order.period,
                order.systemUser,
                formatDate1(order.orderDate),
                order.observations,
                order.providerRuc,
                order.providerDescription,
                order.costcenterAlias ? order.costcenterAlias : order.costCenterId,
                order.isAffectedIGV ? 'Sí' : 'No',
                getCurrencySymbol(order.currency),
                formatCurrency(order.total),
                order.tax ? formatCurrency(order.tax) : order.retention ? formatCurrency(order.retention) : '',
                order.detraction ? formatCurrency(order.detraction) : order.perception ? formatCurrency(order.perception) : '',
                order.products,
                doc?.orderDocumentNumber ?? '',
                doc?.subtotal ? formatCurrency(doc?.subtotal) : '',
                doc?.total ? formatCurrency(doc?.total) : '',
                doc?.documentStatus ?? '',
                doc?.annotation ?? '',
                doc?.sunatCode ?? '',
                doc?.taxCalc ? formatCurrency(doc?.taxCalc) : doc?.retentionCalc ? formatCurrency(doc?.retentionCalc) : '',
                payment?.paymentDate ? formatDate1(formatDateForInput(payment?.paymentDate.split('T')[0])) : '',
                payment?.paidAmount ? formatCurrency(payment?.paidAmount) : '',
            ]);
            row.eachCell({ includeEmpty: true }, cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            })
        };
        data.forEach(order => {
            if (order.documents.length === 0) {
                addOrderRow(order);
            } else {
                order.documents.forEach(doc => {
                    if (doc.payments && doc.payments.length > 0) {
                        doc.payments.forEach(payment => {
                            addOrderRow(order, doc, payment);
                        });
                    } else {
                        addOrderRow(order, doc);
                    }
                })
            }
        });

        const columnWidths: { [key: string]: number } = {
            'A': 15,
            'B': 15,
            'C': 15,
            'D': 15,
            'E': 20,
            'F': 20,
            'G': 50,
            'H': 20,
            'I': 40,
            'J': 20,
            'K': 15,
            'L': 15,
            'M': 15,
            'N': 15,
            'O': 15,
            'P': 50,
            'Q': 15,
            'R': 15,
            'S': 25,
            'T': 15,
            'U': 40,
            'V': 15,
            'W': 15,
            'X': 15,
            'Y': 15,
            'Z': 15
        };

        ws.columns.forEach((column, index) => {
            const columnLetter = String.fromCharCode(65 + index);
            if (columnWidths[columnLetter]) {
                column.width = columnWidths[columnLetter];
            } else {
                column.width = 15;
            }
        });

        let startRow = 2;
        data.forEach(order => {
            const rowCount = order.documents.reduce((acc, doc) =>
                acc + Math.max(1, doc.payments?.length || 0), 0) || 1;

            if (rowCount > 1) {
                for (let col = 1; col <= 16; col++) {
                    ws.mergeCells(startRow, col, startRow + rowCount - 1, col);
                    const cell = ws.getCell(startRow, col);
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            }
            startRow += rowCount;
        });

        startRow = 2;
        data.forEach(order => {
           order.documents.forEach(doc => {
            const rowCount = doc.payments?.length || 1;
            if (rowCount > 1) {
                for (let col = 17; col <= 23; col++) {
                    console.log(startRow, col, startRow + rowCount - 1, col)
                    ws.mergeCells(startRow, col, startRow + rowCount - 1, col);
                    const cell = ws.getCell(startRow, col);
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            }
            startRow += rowCount;
           })
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
        console.error(error);
    }
};

