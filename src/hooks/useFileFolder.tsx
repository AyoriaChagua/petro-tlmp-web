import { useEffect, useState } from "react"
import { ExtensionFileMP, FileMPI, FolderType, SearchFieldFilesI } from "../types/file"
import { decryptString } from "../utils/functions";
import { FileTypeMP } from "../types/common/inputs";
import { useAuth } from "../context/AuthContext";
import { postFile } from "../api/file/post";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { getFiles } from "../api/file/get";
import { deleteFile } from "../api/file/delete";

export const useFileFolder = (numberReference: string) => {

    const [folderType, setFolderType] = useState<FolderType>("order");
    const [fileTypeId, setFileTypeID] = useState("");

    const [orderReference, setOrderReference] = useState({
        correlative: "",
        orderTypeId: "",
        period: "",
        companyId: ""
    });


    const [filesMP, setFilesMP] = useState<FileMPI[]>([]);

    const { user, companySelected } = useAuth();

    const getFilesByType = async ({
        correlative = orderReference.correlative,
        orderTypeId = orderReference.orderTypeId,
        period = orderReference.period,
        companyId = orderReference.companyId
    }: SearchFieldFilesI) => {
        const data = await getFiles.byOrder({
            correlative,
            orderTypeId: orderTypeId.replace("%2F", "/").trim(),
            period,
            companyId,
            fileTypeId
        });
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
        const orderReferenceDecrypt = JSON.parse(decryptString(numberReference))
        setOrderReference(orderReferenceDecrypt);
        if (fileTypeId) {
            getFilesByType({
                correlative: orderReferenceDecrypt.correlative,
                orderTypeId: orderReferenceDecrypt.orderTypeId.replace("/", "%2F"),
                period: orderReferenceDecrypt.period,
                companyId: orderReferenceDecrypt.companyId,
                fileTypeId
            });
        }
    }, [fileTypeId, numberReference]);


    useEffect(() => {
        setFilesMP([]);
        switch (folderType) {
            case "order":
                setFileTypeID("AO");
                break;
            case "document":
                setFileTypeID("AF");
                break;
            case "payment":
                setFileTypeID("AP");
                break;
        }
    }, [folderType]);


    const handleSubmit = async (files: File[], fileTypeId: FileTypeMP) => {
        if (files.length === 0) return;
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileTypeId', fileTypeId);
                formData.append('systemUser', user?.id!);
                if (orderReference.companyId) formData.append('companyId', companySelected?.value!);
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
            if (res.status === 200) {
                setFilesMP(filesMP.filter(file => file.id !== id))
            } else {
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
        setFolderType,
        folderType
    }
}