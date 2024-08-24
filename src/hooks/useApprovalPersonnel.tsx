import { FormEvent, useEffect, useState } from "react"
import { ApprovalPersonnel, ApprovalPersonnelRequest, ApprovalPersonnelUpdateRequest } from "../types/approval-personnel"
import { getApprovalPeronnel } from "../api/approval-personnel/get";
import { showConfirmAlert, showErrorMessage, showSuccessMessage } from "../utils/functions";
import { initialApprovalPersonnelRequest } from "./initial-states/approval-personnel";
import { postApprovalPersonnel } from "../api/approval-personnel/post";
import { useAuth } from "../context/AuthContext";
import { putApprovalPersonnel } from "../api/approval-personnel/put";
import { deleteApprovalPersonnel } from "../api/approval-personnel/delete";

export const useApprovalPersonnel = () => {
    const [approvalPersonnel, setApprovalPersonnel] = useState<ApprovalPersonnel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [approvalPersonnelRequest, setApprovalPersonnelRequest] = useState<ApprovalPersonnelRequest | ApprovalPersonnelUpdateRequest>(initialApprovalPersonnelRequest);
    const [personnelToUpdate, setPersonnelToUpdate] = useState<number | null>(null);
    const { user } = useAuth();

    const fetchApprovalPersonnel = async () => {
        try {
            setIsLoading(true);
            const data = await getApprovalPeronnel.getAll();
            setApprovalPersonnel(data);
        } catch (error) {
            showErrorMessage((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputApprovalPersonnelRequest = (
        value: string,
        field: keyof ApprovalPersonnelRequest | keyof ApprovalPersonnelUpdateRequest
    ) => {
        setApprovalPersonnelRequest(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let dataForToSend: ApprovalPersonnelRequest | ApprovalPersonnelUpdateRequest;
            let newData: ApprovalPersonnel;

            if (personnelToUpdate) {
                dataForToSend = {
                    description: approvalPersonnelRequest.description,
                    phone: approvalPersonnelRequest.phone,
                    modificationUser: user?.id
                } as ApprovalPersonnelUpdateRequest
                if ('modificationUser' in dataForToSend) {
                    newData = await putApprovalPersonnel.update(personnelToUpdate, dataForToSend);
                    setApprovalPersonnel(prevPersonnel => 
                        prevPersonnel.map(item => item.id === personnelToUpdate ? newData : item)
                    );
                } else {
                    throw new Error("Información invalida para actualizar");
                }
            } else {
                dataForToSend = {
                    description: approvalPersonnelRequest.description,
                    phone: approvalPersonnelRequest.phone,
                    systemUser: user?.id
                } as ApprovalPersonnelRequest
                if ('systemUser' in dataForToSend) {
                    newData = await postApprovalPersonnel.create(dataForToSend);
                    setApprovalPersonnel(prevPersonnel => [...prevPersonnel, newData]);
                } else {
                    throw new Error("No se pudo crear al personal");
                }
            }
            setApprovalPersonnelRequest(initialApprovalPersonnelRequest);
            setPersonnelToUpdate(null);
        } catch (error) {
            showErrorMessage((error as Error).message)
        }
    }

    const handleSelectPersonnelToUpdate = (personnel: ApprovalPersonnel) => {
        setPersonnelToUpdate(personnel.id);
        setApprovalPersonnelRequest({
            description: personnel.description,
            phone: personnel.phone,
            modificationUser: user?.id
        });
    };

    const handleDeletePersonnel = async (id: number) => {
        const isConfirmed = await showConfirmAlert(
            '¿Estás seguro?',
            'Esta acción eliminará permanentemente al personal de aprobación.',
            'Sí, eliminar',
            'Cancelar'
        );

        if (isConfirmed) {
            try {
                await deleteApprovalPersonnel.delete(id);
                setApprovalPersonnel(prevPersonnel => 
                    prevPersonnel.filter(personnel => personnel.id !== id)
                );
                showSuccessMessage('Personal de aprobación eliminado con éxito');
            } catch (error) {
                showErrorMessage((error as Error).message);
            }
        }
    };

    useEffect(() => {
        fetchApprovalPersonnel();
    }, []);

    return {
        approvalPersonnel,
        isLoading,
        approvalPersonnelRequest,
        handleInputApprovalPersonnelRequest,
        onSubmit,
        handleSelectPersonnelToUpdate,
        handleDeletePersonnel,
        personnelToUpdate
    };
}