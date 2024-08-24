import { ApprovalPersonnel } from "../../types/approval-personnel"
import { axiosAuthInstance } from "../config"

export const getApprovalPeronnel = {
    getAll: async () => {
        try {
            const response = await axiosAuthInstance.get<ApprovalPersonnel[]>('/approval-personnel');
            return response.data;
        } catch (error) {
            throw new Error('Error obteniendo los datos, ' + (error as Error).message);
        }
    }
}