import { ErrorMessage } from "../../types/common/error";
import { CorrelativeControlReq, CorrelativeControlRes } from "../../types/correlative-control";
import { axiosAuthInstance } from "../config";

export const postCorrelativeControl = {
    create: async (correlativeControl: CorrelativeControlReq) => {
        try {
            const response = await axiosAuthInstance.post<CorrelativeControlRes>("correlative-control", correlativeControl);
            const data = response.data;
            if ("message" in data || response.status !== 201) {
                throw new Error((data as ErrorMessage).message);
            }
            return data;
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}