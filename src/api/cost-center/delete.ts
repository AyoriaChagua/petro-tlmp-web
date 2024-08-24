import { axiosAuthInstance } from "../config"

export const deleteCostCenter = {
    delete: async (id: number) => {
        try {
            const response = await axiosAuthInstance.delete<void>(`/cost-centers/${id}`);
            if(response.status === 204) return response.data;
            else throw new Error("No se pudo eliminar el centro de costo");
        } catch (error) {
            throw new Error(`Error eliminando el centro de costo con id: ${id}`);
        }
    }
}