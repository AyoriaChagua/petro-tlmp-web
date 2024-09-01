import { useParams } from "react-router-dom";
import { decryptString } from "../../../utils/functions";

export default function CreateDocument() {

    const { orderCompanyId, orderTypeId, orderPeriod, orderCorrelative } = useParams<{
        orderCompanyId: string;
        orderTypeId: string;
        orderPeriod: string;
        orderCorrelative: string;
    }>();
    
    const decryptedCompanyId = decryptString(orderCompanyId!);
    const decryptedOrderTypeId = decryptString(orderTypeId!);
    const decryptedOrderPeriod = decryptString(orderPeriod!);
    const decryptedOrderCorrelative = decryptString(orderCorrelative!);

    return (
        <div>
            <h1>Documentos</h1>
            <h1>{decryptedCompanyId}</h1>
            <h1>{decryptedOrderTypeId}</h1>
            <h1>{decryptedOrderPeriod}</h1>
            <h1>{decryptedOrderCorrelative}</h1>
        </div>
    )
}
