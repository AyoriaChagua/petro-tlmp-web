import * as XLSX from 'xlsx';
import { OrderWithDocumentsI } from '../../types/reports';


export const exportToExcel = (
    data: OrderWithDocumentsI[],
    fileName: string,
) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    let rowIndex = 1;

    const header = [
        'Número de Orden', 'Tipo de Orden', 'Fecha de Orden', 'Periodo', 'ID de Compañía',
        'Usuario del Sistema', 'Observaciones', 'RUC del Proveedor', 'Descripción del Proveedor',
        'ID del Centro de Costo', 'Descripción del Centro de Costo', 'Alias del Centro de Costo',
        'Moneda', 'Total', 'Detracción', 'Percepción', 'Retención', 'Impuesto', 'Afecto a IGV',
        'Productos', 'Número de Documento', 'Subtotal', 'Total Documento', 'CIA', 'Fecha Documento',
        'Estado del Documento', 'Anotación', 'Código SUNAT', 'Cálculo de Retención',
        'Cálculo de Impuesto', 'Fecha de Pago', 'Monto Pagado', 'Está Activo',
        'ID de Pago del Documento', 'ID de Pago'
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: -1 });

    data.forEach((orderDocument) => {
        const orderRowStart = rowIndex;

        orderDocument.documents.forEach((doc) => {
            const row = [
                orderDocument.correlative, orderDocument.orderTypeId, orderDocument.orderDate, orderDocument.period,
                orderDocument.companyId, orderDocument.systemUser, orderDocument.observations, orderDocument.providerRuc,
                orderDocument.providerDescription, orderDocument.costCenterId, orderDocument.costCenterDescription,
                orderDocument.costcenterAlias, orderDocument.currency, orderDocument.total, orderDocument.detraction,
                orderDocument.perception, orderDocument.retention, orderDocument.tax, orderDocument.isAffectedIGV,
                orderDocument.products, doc.orderDocumentNumber, doc.subtotal, doc.total, doc.cia,
                doc.date, doc.documentStatus, doc.annotation, doc.sunatCode,
                doc.retentionCalc, doc.taxCalc
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: `A${rowIndex}` });
            if (doc.payments && doc.payments.length > 0) {
                doc.payments.forEach((payment) => {
                    const paymentRow = [
                        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                        '', '', '', '', '', '', '', '', '', '', '',
                        payment.paymentDate, payment.paidAmount, payment.isActive,
                        payment.documentPaymentId, payment.paymentId
                    ];
                    rowIndex++;
                    XLSX.utils.sheet_add_aoa(worksheet, [paymentRow], { origin: `A${rowIndex}` });
                });
                for (let col = 20; col < 30; col++) {
                    const cellRef = XLSX.utils.encode_cell({ r: orderRowStart - 1, c: col });
                    const mergeRef = XLSX.utils.encode_range({
                        s: { r: orderRowStart - 1, c: col },
                        e: { r: rowIndex - 2, c: col }
                    });
                    if (worksheet[cellRef]) {
                        worksheet[cellRef].s = { alignment: { vertical: 'center' } };
                    }
                    if (!worksheet['!merges']) worksheet['!merges'] = [];
                    worksheet['!merges'].push(XLSX.utils.decode_range(mergeRef));
                }
            } else {
                rowIndex++;
            }
        });
        if (orderDocument.documents.length > 1) {
            for (let col = 0; col < 20; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: orderRowStart - 1, c: col });
                const mergeRef = XLSX.utils.encode_range({
                    s: { r: orderRowStart - 1, c: col },
                    e: { r: rowIndex - 2, c: col }
                });
                if (worksheet[cellRef]) {
                    worksheet[cellRef].s = { alignment: { vertical: 'center' } };
                }

                if (!worksheet['!merges']) worksheet['!merges'] = [];
                worksheet['!merges'].push(XLSX.utils.decode_range(mergeRef));
            }

        }
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Órdenes');

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
        let max = 0;
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const cell = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
            if (cell && cell.v) max = Math.max(max, String(cell.v).length);
        }
        worksheet['!cols'] = worksheet['!cols'] || [];
        worksheet['!cols'][C] = { wch: max + 2 };
    }

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

