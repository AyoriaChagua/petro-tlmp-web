import { useEffect, useState } from "react";
import { getOrderDocument } from "../api/order-document/get";
import { PaymentDocumentFormI, PaymentResponseI } from "../types/order-document";
import { showErrorMessage, showSuccessMessage } from "../utils/alerts";
import { postOrderDocument } from "../api/order-document/post";
import { useAuth } from "../context/AuthContext";
import { postFile } from "../api/file/post";
import { formatDate2 } from "../utils/dates";
import { MultiValue, SingleValue } from "react-select";
import { OptionType } from "../types/common/inputs";

interface ParamsToCreate {
    readonly companyId: string;
    readonly orderDocumentNumber: string
}

export const useDocumentPayment = ({ companyId, orderDocumentNumber }: ParamsToCreate) => {

    const { user } = useAuth();
    const [paymentDocuments, setPaymentDocuments] = useState<PaymentResponseI[]>([]);

    const [paymentDocumentForm, setPaymentDocumentForm] = useState<PaymentDocumentFormI[]>([{
        amountPaid: "",
        issueDate: formatDate2(new Date()),
        currencyLabel: "SOLES",
        currencyValue: "PEN",
        file: new File([], "")
    }])

    useEffect(() => {
        (async () => {
            const data = await getOrderDocument.findPaymentsByDocument(companyId, orderDocumentNumber);
            setPaymentDocuments(data);
        })();
    }, [companyId, orderDocumentNumber]);

    const handleAddPayment = () => {
        setPaymentDocumentForm(prevState => [...prevState, {
            amountPaid: "",
            issueDate: formatDate2(new Date()),
            currencyLabel: "SOLES",  
            currencyValue: "PEN",
            file: new File([], "")
        }])
    };

    const handleRemovePayment = (index: number) => {
        setPaymentDocumentForm(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = event.target;
        setPaymentDocumentForm(prevState => prevState.map((form, i) => {
            if (i === index) {
                return {
                    ...form,
                    file: files ? files[0] : new File([], "")
                };
            }
            return form;
        }));
    };

    const handleOptionSelection =(option : SingleValue<OptionType> | MultiValue<OptionType>, index: number, field1: keyof PaymentDocumentFormI, field2?: keyof PaymentDocumentFormI) => {
        const singleOption = option as SingleValue<OptionType>
        if(singleOption) {
            setPaymentDocumentForm(prevState => prevState.map((form, i) => {
                if (i === index) {
                    return {
                        ...form,
                        [field1]: singleOption?.value!,
                        [field2!]: singleOption?.label!
                    };
                }
                return form;
            }));
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof {
        amountPaid: string;
        issueDate: string;
        file: File
    }, index: number) => {
        const { value } = event.target;
        setPaymentDocumentForm(prevState => prevState.map((form, i) => {
            if (i === index) {
                return {
                    ...form,
                    [field]: value
                };
            }
            return form;
        }));
    };

    const createPaymentDocuments = async (paidAmount: number, paymentDate: string, currency: string) => {
        try {
            const data = await postOrderDocument.createPaymentDocument({
                companyId,
                orderDocumentNumber,
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
            await Promise.all(paymentDocumentForm.map(async (form) => {
                console.log(form)
                const data = await createPaymentDocuments(parseInt(form.amountPaid), form.issueDate, form.currencyValue);
                console.log(data)

                if (data) {
                    const formData = new FormData();
                    formData.append('file', form.file);
                    formData.append('fileTypeId', "AP");
                    formData.append('systemUser', user!.id);
                    formData.append('paymentId', data.paymentId.toString());

                    const response = await postFile.createFile(formData);

                    if (response) {
                        showSuccessMessage("El pago fue creado exitosamente");
                    }
                }
            }));
        } catch (error) {
            showErrorMessage((error as Error).message);
        }
    };

    return {
        paymentDocuments,
        paymentDocumentForm,
        handleAddPayment,
        handleRemovePayment,
        setPaymentDocumentForm,
        handleInputFileChange,
        handleInputChange,
        onSubmit,
        handleOptionSelection
    }
}