import { FormEvent, useEffect, useState } from "react"
import { SunatDocumentI, SunatDocumentRequestI, SunatDocumentRequestToUpdateI } from "../types/sunat-document";
import { getSunatDocument } from "../api/sunat-document-type/get";
import { showConfirmAlert, showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { initialSunatDocument } from "./initial-states/sunat-document";
import { useAuth } from "../context/AuthContext";
import { postSunatDocument } from "../api/sunat-document-type/post";
import { putSunatDocument } from "../api/sunat-document-type/put";
import { deleteSunatDocument } from "../api/sunat-document-type/delete";
import { splitArrayIntoChunks } from "../utils/functions";

export const useSunatDocument = () => {
    const [sunatDocuments, setSunatDocuments] = useState<SunatDocumentI[]>([]);
    const [sunatDocumentChunks, setSunatDocumentChunks] = useState<SunatDocumentI[][]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sunatDocumentRequest, setSunatDocumentRequest] = useState<SunatDocumentRequestI | SunatDocumentRequestToUpdateI>(initialSunatDocument);
    const [idSunatDocumentToUpdate, setIdSunatDocumentToUpdate] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();

    const fetchSunatDocuments = async () => {
        try {
            setIsLoading(true);
            const data = await getSunatDocument.getAll();
            const dataChunks = splitArrayIntoChunks(data, 10);
            setSunatDocumentChunks(dataChunks);
            setSunatDocuments(dataChunks[0]);
        } catch (error) {
            showErrorMessage("No se pudo obtener los tipos de documento de Sunat");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputSunatDocument = (value: string, field: keyof SunatDocumentRequestI | keyof SunatDocumentRequestToUpdateI) => {
        setSunatDocumentRequest(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let dataForToSend: SunatDocumentRequestI | SunatDocumentRequestToUpdateI;
            let newData: SunatDocumentI;
            if (idSunatDocumentToUpdate) {
                dataForToSend = {
                    description: sunatDocumentRequest.description,
                    modifiedUser: user?.id,
                    sunatCode: sunatDocumentRequest.sunatCode
                } as SunatDocumentRequestToUpdateI;
                newData = await putSunatDocument.update(idSunatDocumentToUpdate, dataForToSend);
                setSunatDocuments(prevState =>
                    prevState.map(doc => doc.documentTypeId === idSunatDocumentToUpdate ? newData : doc)
                );
            } else if ('documentTypeId' in sunatDocumentRequest) {
                    dataForToSend = {
                        documentTypeId: sunatDocumentRequest.documentTypeId,
                        description: sunatDocumentRequest.description,
                        sunatCode: sunatDocumentRequest.sunatCode,
                        systemUser: user?.id
                    } as SunatDocumentRequestI;
                    newData = await postSunatDocument.create(dataForToSend);
                    showSuccessMessage("Tipo de Documento de sunat creado");
                    setSunatDocumentChunks(
                        prevState => [...prevState, [newData]]
                    );
                } else {
                    throw new Error("Campos invalidos para crear el tipo de documento")
                }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    const handleSelectSunatDocument = (sunatDocument: SunatDocumentI | null) => {
        if (sunatDocument) {
            setIdSunatDocumentToUpdate(sunatDocument.documentTypeId);
            setSunatDocumentRequest({
                description: sunatDocument.description,
                sunatCode: sunatDocument.sunatCode,
                documentTypeId: sunatDocument.documentTypeId,
                modifiedUser: user?.id!
            });
        } else {
            setIdSunatDocumentToUpdate(null);
            setSunatDocumentRequest(initialSunatDocument);
        }
    };

    const handleDeleteSunatDocument = async (id: string) => {
        const isConfirmed = await showConfirmAlert(
            '¿Estás seguro?',
            'Tome en cuenta que no podrá usar el mismo codigo para el sistema.',
            'Sí, eliminar',
            'Cancelar'
        );

        if (isConfirmed) {
            try {
                await deleteSunatDocument.delete(id);
                setSunatDocuments(prevSunatDocuments =>
                    prevSunatDocuments.filter(sunatDocument => sunatDocument.documentTypeId !== id)
                );
                showSuccessMessage('Tipo de documento Sunat eliminado con éxito');
            } catch (error) {
                showErrorMessage((error as Error).message);
            }
        }
    };

    
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setSunatDocuments(sunatDocumentChunks[pageNumber - 1]);
    };

    useEffect(() => {
        setCurrentPage(1);
        setSunatDocuments(sunatDocumentChunks[0]);
        fetchSunatDocuments();
    }, []);

    return {
        sunatDocuments,
        isLoading,
        handleInputSunatDocument,
        onSubmit,
        handleSelectSunatDocument,
        handleDeleteSunatDocument,
        idSunatDocumentToUpdate,
        sunatDocumentRequest,
        sunatDocumentChunks,
        handlePageChange,
        currentPage
    };
}