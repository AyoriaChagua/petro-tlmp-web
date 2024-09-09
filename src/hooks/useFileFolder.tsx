import { useEffect, useState } from "react"
import { FolderType } from "../types/file"
import { decryptString } from "../utils/functions";

export const useFileFolder = (folderType: FolderType, numberReference: string) => {

    const [orderReference, setOrderReference] = useState({
        correlative: "",
        orderTypeId: "",
        period: "",
        companyId: ""
    })


    useEffect(() => {
        if (folderType === "order") {
            setOrderReference(JSON.parse(decryptString(numberReference)))
        } 
    }, [folderType, numberReference])

    return {
        numberReference: decryptString(numberReference),
        orderReference
    }
}