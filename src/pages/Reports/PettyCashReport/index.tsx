import { ReportLayout } from "../../../components";


export default function PettyCashReport() {
    return (
        <ReportLayout reportType="pettyCash" onSubmit={() => { }}>
            <div className='mt-24'>PettyCashReport</div>
        </ReportLayout>
    )
}
