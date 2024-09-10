import { Page,  Document,  pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

function OrderPdf() {
    return (
        <Document>
            <Page>
            </Page>
        </Document>
    )
}

export default function OrderPdfGenerator() {
    const downloadPdf = async () => {
        const fileName = 'test.pdf';
        const blob = await pdf(<OrderPdf />).toBlob();
        saveAs(blob, fileName);
    };

    return <button onClick={downloadPdf}>Download PDF</button>;
}