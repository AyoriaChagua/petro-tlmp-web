import { useEffect, useState } from "react"
import { ExtensionFileMP, FileMPI, FolderType } from "../types/file"
import { decryptString } from "../utils/functions";
import { FileTypeMP } from "../types/common/inputs";
import { useAuth } from "../context/AuthContext";
import { postFile } from "../api/file/post";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { getFiles } from "../api/file/get";
import { deleteFile } from "../api/file/delete";

export const useFileFolder = (folderType: FolderType, numberReference: string) => {

    const [orderReference, setOrderReference] = useState({
        correlative: "",
        orderTypeId: "",
        period: "",
        companyId: ""
    });

    const [filesMP, setFilesMP] = useState<FileMPI[]>([]);
    const [showPaymentsFiles, setShowPaymentsFiles] = useState(false);

    const { user, companySelected } = useAuth();

    const getFilesByOrder = async (
        correlative: string = orderReference.correlative,
        orderTypeId: string = orderReference.orderTypeId,
        period: string = orderReference.period,
        companyId: string = orderReference.companyId
    ) => {
        const data = await getFiles.byOrder(
            correlative,
            orderTypeId,
            period,
            companyId
        );
        const filesFromData: FileMPI[] = data.map((file) => {
            return {
                id: file.id,
                name: file.fileName,
                fileTypeId: file.fileTypeId as FileTypeMP,
                extensionFile: file.fileName.split('.').pop() as ExtensionFileMP
            }
        })
        setFilesMP(filesFromData);
    };

    const getByDocument = async () => {
        const data = await getFiles.byDocument(decryptString(numberReference), companySelected?.value!);
        const filesFromData: FileMPI[] = data.map((file) => {
            return {
                id: file.id,
                name: file.fileName,
                fileTypeId: file.fileTypeId as FileTypeMP,
                extensionFile: file.fileName.split('.').pop() as ExtensionFileMP
            }
        })
        setFilesMP(filesFromData);
    };

    const getFilesByPayment = async () => {
        const data = await getFiles.byPayment(decryptString(numberReference), companySelected?.value!);
        console.log(data)
        const filesFromData: FileMPI[] = data.map((file) => {
            return {
                id: file.id,
                name: file.fileName,
                fileTypeId: file.fileTypeId as FileTypeMP,
                extensionFile: file.fileName.split('.').pop() as ExtensionFileMP
            }
        })
        setFilesMP(filesFromData);
    };


    useEffect(() => {
        if (folderType === "order") {
            const orderReferenceDecrypt = JSON.parse(decryptString(numberReference))
            setOrderReference(orderReferenceDecrypt);
            getFilesByOrder(
                orderReferenceDecrypt.correlative,
                orderReferenceDecrypt.orderTypeId.replace("/", "%2F"),
                orderReferenceDecrypt.period,
                orderReferenceDecrypt.companyId
            );
        } else if (folderType === "document") {
            getByDocument();
        }
    }, [folderType, numberReference]);

    useEffect(() => {
        if (showPaymentsFiles) {
            getFilesByPayment();
        } else {
            getByDocument().catch(() => {
                setFilesMP([]);
            });
        }
    }, [showPaymentsFiles])
    


    const handleSubmit = async (files: File[], fileTypeId: FileTypeMP) => {
        if (files.length === 0) return;
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileTypeId', fileTypeId);
                formData.append('systemUser', user?.id!);
                if (folderType === "document") formData.append('orderDocumentNumber', decryptString(numberReference));
                if (orderReference.companyId  || folderType === "document") formData.append('companyId', companySelected?.value!);
                if (orderReference.orderTypeId) formData.append('orderTypeId', orderReference.orderTypeId);
                if (orderReference.period) formData.append('period', orderReference.period);
                if (orderReference.correlative) formData.append('correlative', orderReference.correlative);
                const res = await postFile.createFile(formData);
                if (res) {
                    setFilesMP(prev => [...prev, {
                        id: res.id,
                        name: res.fileName,
                        extensionFile: res.fileName.split('.').pop() as ExtensionFileMP,
                        fileTypeId
                    }]);
                }
                return res;
            });

            const results = await Promise.all(uploadPromises);

            if (results.every(result => result)) {
                showSuccessMessage('Todos los archivos fueron creados exitosamente');
            } else {
                throw new Error('No se pudieron crear algunos archivos');
            }

        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    const handleDeleteFile = async (id: number) => {
        try {
            const res = await deleteFile.delete(id);    
            if(res.status === 200) {
                setFilesMP(filesMP.filter(file => file.id !== id))
            }else {
                throw new Error('No se pudo eliminar el archivo');
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    }



    return {
        numberReference: decryptString(numberReference),
        orderReference,
        handleSubmit,
        filesMP,
        handleDeleteFile,
        showPaymentsFiles,
        setShowPaymentsFiles
    }
}