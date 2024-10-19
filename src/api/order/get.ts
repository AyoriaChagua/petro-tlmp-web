import { PaymentResponseI } from "../../types/order-document";
import { FieldsOrderID, OrderWithDocumentsI, QueryFieldsI } from "../../types/reports"
import { OrderTypeEnum } from "../../utils/constants";
import { axiosAuthInstance } from "../config"

export const getOrder = {
    filterOrderWithDocuments: async (params: QueryFieldsI) => {
        try {
            const response = await axiosAuthInstance.get<OrderWithDocumentsI[]>("/order-mp/with-documents", { params });
            return (response).data
        } catch (error) {
            throw new Error("Error obteniendo los datos, " + (error as Error).message);
        }
    },

    generatePdf: async (params: FieldsOrderID) => {
        try {
            const response = await axiosAuthInstance.get("/order-mp/pdf", {
                params,
                responseType: 'blob', 
            });
    
            if (response.status !== 200) {
                throw new Error("No se pudo generar el pdf");
            }
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', OrderTypeEnum[params.orderTypeId as keyof typeof OrderTypeEnum] + "-" + params.correlative + ".pdf"); 
            document.body.appendChild(link);
            link.click();
            link.remove(); 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    
    payments: async (params: FieldsOrderID) => {
        try {
            const response = await axiosAuthInstance.get<PaymentResponseI[]>("/order-payment", { params });
            if(response.status !== 200) {
                throw new Error("No se pudo obtener los pagos");
            }
            console.log(JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
}