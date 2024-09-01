import { ReportLayout } from "../../../components";


export default function PurchasingReport() {
    return (
        <ReportLayout reportType="purchasing" onSubmit={() => { }}>
            <div className='mt-24'>PettyCashReport</div>
        </ReportLayout>
    )
}
