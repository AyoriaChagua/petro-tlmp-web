import { SunatDocumentI } from "../../types/sunat-document"
import { axiosAuthInstance } from "../config"

export const getSunatDocument = {
    getAll: async () => {
        try {
            const response = await axiosAuthInstance.get<SunatDocumentI[]>("/sunat-document-types");
            return response.data;
        } catch (error) {
            throw new Error("Error obteniendo los tipos de documento Sunat");
        }
    }
}