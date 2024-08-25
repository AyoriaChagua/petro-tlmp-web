import { FormEvent, useEffect, useState } from "react"
import { CostCenterI, CostCenterRequestI, CostCenterUpdateRequestI } from "../types/cost-center"
import { getCostCenter } from "../api/cost-center/get";
import { useAuth } from "../context/AuthContext";
import { showConfirmAlert, showErrorMessage, showSuccessMessage } from "../utils/functions";
import { initialCostCenterRequest } from "./initial-states/cost-center";
import { deleteCostCenter } from "../api/cost-center/delete";
import { putCostCenter } from "../api/cost-center/put";
import { postCostCenter } from "../api/cost-center/post";

export const useCostCenter = () => {
    const [costCenters, setCostCenters] = useState<CostCenterI[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [costCenterRequest, setCostCenterRequest] = useState<CostCenterRequestI | CostCenterUpdateRequestI>(initialCostCenterRequest);
    const [costCenterToUpdate, setCostCenterToUpdate] = useState<number | null>(null);
    const { user, companySelected } = useAuth();

    const fetchCostCenters = async () => {
        try {
            setIsLoading(true);
            const data = await getCostCenter.getByCompanyId(companySelected?.value!);
            setCostCenters(data);
        } catch (error) {
            showErrorMessage((error as Error).message);
        } finally {
            setIsLoading(false);

        }
    }

    const handleInputCostCenterRequest = (value: string, field: keyof CostCenterRequestI | keyof CostCenterUpdateRequestI) => {
        setCostCenterRequest((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let dataForToSend: CostCenterRequestI | CostCenterUpdateRequestI;
            let newData: CostCenterI;
            if (costCenterToUpdate) {
                dataForToSend = {
                    companyId: costCenterRequest.companyId,
                    description: costCenterRequest.description,
                    aliasReport: costCenterRequest.aliasReport
                } as CostCenterUpdateRequestI;
                newData = await putCostCenter.update(costCenterToUpdate, dataForToSend);
                setCostCenters(prevCostCenters =>
                    prevCostCenters.map(costCenter => costCenter.id === costCenterToUpdate ? newData : costCenter)
                );
            } else {
                dataForToSend = {
                    companyId: companySelected?.value,
                    description: costCenterRequest.description,
                    aliasReport: costCenterRequest.aliasReport,
                    systemUser: user?.id
                } as CostCenterRequestI;
                if ('systemUser' in dataForToSend) {
                    newData = await postCostCenter.create(dataForToSend);
                    showSuccessMessage('Centro de costo creado con éxito');
                    setCostCenters(prevCostCenters => [...prevCostCenters, newData]);
                } else {
                    showErrorMessage('No se pudo crear el centro de costo');
                }

            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    const handleSelectCostCenterToUpdate = (costCenter: CostCenterI | null) => {
        if (costCenter) {
            setCostCenterToUpdate(costCenter.id);
            setCostCenterRequest({
                companyId: costCenter.companyId,
                description: costCenter.description,
                aliasReport: costCenter.aliasReport
            });
        } else {
            setCostCenterToUpdate(null);
            setCostCenterRequest(initialCostCenterRequest);
        }
    };

    const handleDeletePersonnel = async (id: number) => {
        const isConfirmed = await showConfirmAlert(
            '¿Estás seguro?',
            'Esta acción eliminará permanentemente el centro de costo.',
            'Sí, eliminar',
            'Cancelar'
        );

        if (isConfirmed) {
            try {
                await deleteCostCenter.delete(id);
                setCostCenters(prevCostCenters =>
                    prevCostCenters.filter(costCenter => costCenter.id !== id)
                );
                showSuccessMessage('Centro de costo eliminado con éxito');
            } catch (error) {
                showErrorMessage((error as Error).message);
            }
        }
    };

    useEffect(() => {
        fetchCostCenters();
    }, [])

    return {
        costCenters,
        isLoading,
        onSubmit,
        handleDeletePersonnel,
        handleInputCostCenterRequest,
        handleSelectCostCenterToUpdate,
        costCenterToUpdate,
        costCenterRequest
    }
}