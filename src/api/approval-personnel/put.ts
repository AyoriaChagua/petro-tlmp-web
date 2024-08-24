import { ApprovalPersonnel, ApprovalPersonnelUpdateRequest } from "../../types/approval-personnel";
import { axiosAuthInstance } from "../config";

export const putApprovalPersonnel = {
    update: async (id: number, approvalPersonnel: ApprovalPersonnelUpdateRequest) => {
        try {
            const response = await axiosAuthInstance.put<ApprovalPersonnel>(`/approval-personnel/${id}`, approvalPersonnel);
            return response.data;
        } catch (error) {
            throw new Error(`Error al actualizar la aprobación ${id}`);
        }
    }
}