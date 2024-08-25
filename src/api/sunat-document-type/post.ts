import { SunatDocumentRequestI } from "../../types/sunat-document";
import { axiosAuthInstance } from "../config";

export const postSunatDocument = {
    create: async (newSunatDocument: SunatDocumentRequestI) => {
        try {
            const response = await axiosAuthInstance.post("/sunat-document-types", newSunatDocument);
            return response.data;
        } catch (error) {
            throw new Error("Error creando el documento Sunat");
        }
    }
}