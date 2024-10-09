import { useEffect, useState } from "react";
import { PaymentDocumentFormI, PaymentResponseI } from "../types/order-document";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { useAuth } from "../context/AuthContext";
import { postFile } from "../api/file/post";
import { formatDate2 } from "../utils/dates";
import { MultiValue, SingleValue } from "react-select";
import { OptionType } from "../types/common/inputs";
import { getOrder } from "../api/order/get";
import { postOrder } from "../api/order/post";

interface ParamsToCreate {
    readonly companyId: string;
    readonly orderTypeId: string;
    readonly period: string;
    readonly correlative: string;
}

export const useDocumentPayment = (params: ParamsToCreate) => {

    const { user } = useAuth();
    const [paymentDocuments, setPaymentDocuments] = useState<PaymentResponseI[]>([]);

    const [paymentDocumentForm, setPaymentDocumentForm] = useState<PaymentDocumentFormI>({
        amountPaid: "",
        issueDate: formatDate2(new Date()),
        currencyLabel: "SOLES",
        currencyValue: "PEN",
        file: new File([], "")
    })

    useEffect(() => {
        (async () => {
            const data = await getOrder.payments(params);
            setPaymentDocuments(data);
        })();
    }, [params]);




    const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (files && files.length > 0) {
            setPaymentDocumentForm(prevState => ({
                ...prevState,
                file: files ? files[0] : new File([], "")
            }));
        }
    };

    const handleOptionSelection = (option: SingleValue<OptionType> | MultiValue<OptionType>, field1: keyof PaymentDocumentFormI, field2?: keyof PaymentDocumentFormI) => {
        const singleOption = option as SingleValue<OptionType>
        if (singleOption) {
            setPaymentDocumentForm(prevState => ({
                ...prevState,
                [field1]: singleOption?.value!,
                [field2!]: singleOption?.label!
            }))
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof {
        amountPaid: string;
        issueDate: string;
        file: File
    }) => {
        const { value } = event.target;
        setPaymentDocumentForm(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const createPaymentDocuments = async (paidAmount: number, paymentDate: string, currency: string) => {
        try {
            const data = await postOrder.createPayment({
                companyId: params.companyId,
                orderTypeId: params.orderTypeId,
                period: params.period,
                correlative: params.correlative,
                paidAmount,
                paymentDate,
                systemUser: user!.id,
                currency
            });

            if (data) {
                return data
            } else {
                throw new Error("No se pudo crear el documento de pago");
            }
        } catch (error) {
            showErrorMessage("No se pudo crear el documento de pago");
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(paymentDocumentForm)
        try {

            const data = await createPaymentDocuments(parseFloat(paymentDocumentForm.amountPaid), paymentDocumentForm.issueDate, paymentDocumentForm.currencyValue);

            if (data && paymentDocumentForm.file) {
                const formData = new FormData();
                formData.append('file', paymentDocumentForm.file);
                formData.append('fileTypeId', "AP");
                formData.append('systemUser', user!.id?.toUpperCase());
                formData.append('paymentId', data.paymentId.toString());

                const response = await postFile.createFile(formData);

                if (response) {
                    showSuccessMessage("El pago fue creado exitosamente");
                }
            } else if (data) {
                showSuccessMessage("El pago fue creado exitosamente");
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    return {
        paymentDocuments,
        paymentDocumentForm,
        setPaymentDocumentForm,
        handleInputFileChange,
        handleInputChange,
        onSubmit,
        handleOptionSelection
    }
}