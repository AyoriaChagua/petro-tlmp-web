import { axiosAuthInstance } from "../config";

export const deleteApprovalPersonnel = {
    delete: async (id: number) => {
        try {
            const response = await axiosAuthInstance.delete<void>(`/approval-personnel/${id}`);
            if(response.status !== 204) throw new Error("No se eliminó al personal")
            return response.data;
        } catch (error) {
            throw new Error(`Error al eliminar el aprovador con id ${id}`);
        }
    }
}