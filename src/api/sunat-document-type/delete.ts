import { axiosAuthInstance } from "../config";

export const deleteSunatDocument = {
    delete: async (id: string) => {
        try {
            const response = await axiosAuthInstance.delete<void>(`/sunat-document-types/${id}`);
            if(response.status !== 204) throw new Error("No se pudo elimnar al área solicitante");
        } catch (error) {
            throw new Error("Error elimnando el documento Sunat");
        }
    }
}