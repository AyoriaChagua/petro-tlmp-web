import { ApprovalPersonnel, ApprovalPersonnelRequest } from "../../types/approval-personnel"
import { axiosAuthInstance } from "../config"

export const postApprovalPersonnel = {
    create: async (newApprovalPersonnel: ApprovalPersonnelRequest) => {
        try {
            const response = await axiosAuthInstance.post<ApprovalPersonnel>('/approval-personnel', newApprovalPersonnel);
            return response.data;
        } catch (error) {
            throw new Error('Error creando al nuevo personal, ' + (error as Error).message);
        }
    }
}