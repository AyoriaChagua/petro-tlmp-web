import { SunatDocumentI, SunatDocumentRequestToUpdateI } from "../../types/sunat-document"
import { axiosAuthInstance } from "../config"

export const putSunatDocument = {
    update: async (id: string, sunatDocumentUpdate: SunatDocumentRequestToUpdateI) => {
        try {
            const response = await axiosAuthInstance.put<SunatDocumentI>(`/sunat-document-types/${id}`, sunatDocumentUpdate);
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando el documento Sunat con ID ${id}`);
        }
    },
    sumFrequency: async (id: string) => {
        try {
            const response = await axiosAuthInstance.patch<void>(`/sunat-document-types/${id}`);
            if(response.status !== 200) throw new Error("NO se pudo sumar la frecuencia")
        } catch (error) {
            throw new Error(`Error actualizando el documento Sunat con ID ${id}`);
        }
    }
}