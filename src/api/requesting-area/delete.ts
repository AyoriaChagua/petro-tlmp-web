import { axiosAuthInstance } from "../config"

export const deleteRequestingAreas = {
    delete: async (idArea: number) => {
        try {
            const response = await axiosAuthInstance.delete<void>(`/requesting-areas/${idArea}`);
            if(response.status !== 204) throw new Error("No se pudo elimnar al área solicitante");
        } catch (error) {
            console.log(error)
            throw new Error(`Error eliminando el área solicitante ${idArea}`);
        }
    }
}