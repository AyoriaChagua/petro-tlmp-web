import { CostCenterRequestI, CostCenterUpdateRequestI } from "../../types/cost-center";

export const initialCostCenterRequest: CostCenterRequestI | CostCenterUpdateRequestI = {
    companyId: "",
    description: "",
    systemUser: "",
    aliasReport: ""
} as CostCenterRequestI