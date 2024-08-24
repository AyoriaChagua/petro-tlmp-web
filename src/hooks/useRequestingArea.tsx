import { FormEvent, useEffect, useState } from "react"
import { RequestingAreaI, RequestingAreaRequestI } from "../types/requesting-area"
import { getRequestingArea } from "../api/requesting-area/get";
import { showConfirmAlert, showErrorMessage, showSuccessMessage } from "../utils/functions";
import { initialRequestingArea } from "./initial-states/requesting-area";
import { deleteRequestingAreas } from "../api/requesting-area/delete";
import { postRequestingArea } from "../api/requesting-area/post";
import { putRequestingArea } from "../api/requesting-area/put";

export const useRequestingArea = () => {
    const [requestingAreas, setRequestingAreas] = useState<RequestingAreaI[]>([]);
    const [requestingAreaRequest, setRequestingAreaRequest] = useState<RequestingAreaRequestI>(initialRequestingArea);
    const [idAreaToUpdate, setIdAreaToUpdate] = useState<number | null>(null)

    const [isLoading, setIsLoading] = useState(false);

    const fetchRequestingAreas = async () => {
        try {
            setIsLoading(true);
            const data = await getRequestingArea.getAll();
            setRequestingAreas(data);
        } catch (error) {
            showErrorMessage((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputRequestingArea = (value: string, field: keyof RequestingAreaRequestI) => {
        setRequestingAreaRequest({
            ...requestingAreaRequest,
            [field]: value
        });
    };

    const handleSelectAreaToUpdate = (requestingArea: RequestingAreaI) => {
        setIdAreaToUpdate(requestingArea.id);
        setRequestingAreaRequest({
            description: requestingArea.description
        });
    };

    const handleDeleteArea = async (id: number) => {
        const isConfirmed = await showConfirmAlert(
            '¿Estás seguro?',
            'Esta acción eliminará permanentemente el área.',
            'Sí, eliminar',
            'Cancelar'
        );

        if (isConfirmed) {
            try {
                await deleteRequestingAreas.delete(id);
                setRequestingAreas(prevRequestingAreas =>
                    prevRequestingAreas.filter(area => area.id !== id)
                );
                showSuccessMessage('Área eliminada con éxito');
            } catch (error) {
                showErrorMessage((error as Error).message);
            }
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(idAreaToUpdate){
                const areaUpdated = await putRequestingArea.update(idAreaToUpdate, requestingAreaRequest);
                setRequestingAreas(prevRequestingAreas =>
                    prevRequestingAreas.map(area => area.id === areaUpdated.id? areaUpdated : area)
                );
            } else {
                const newArea = await postRequestingArea.create(requestingAreaRequest);
                setRequestingAreas([...requestingAreas, newArea]);

            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }

    useEffect(() => {
        fetchRequestingAreas();
    }, []);


    return {
        isLoading,
        requestingAreas,
        requestingAreaRequest,
        handleInputRequestingArea,
        handleSelectAreaToUpdate,
        handleDeleteArea,
        onSubmit,
        idAreaToUpdate
    }
}