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
import { getCurrencyDescription } from "../utils/functions";
import { deleteOrder } from "../api/order/delete";

interface ParamsToCreate {
    readonly companyId: string;
    readonly orderTypeId: string;
    readonly period: string;
    readonly correlative: string;
}

export const useDocumentPayment = (params: ParamsToCreate) => {
    const initialFormState = {
        amountPaid: "",
        issueDate: formatDate2(new Date()),
        currencyLabel: "SOLES",
        currencyValue: "PEN",
        file: null
    }
    const { user } = useAuth();
    const [paymentDocuments, setPaymentDocuments] = useState<PaymentResponseI[]>([]);

    const [paymentDocumentForm, setPaymentDocumentForm] = useState<PaymentDocumentFormI>(initialFormState)

    const [paymentIdToUpdate, setPaymentIdToUpdate] = useState(0);
    const [uploadOnlyFile, setUploadOnlyFile] = useState(false);


    const fetchData = async () => {
        const data = await getOrder.payments(params);
        setPaymentDocuments(data);
    }

    useEffect(() => {
        if (params) {
            fetchData();
        }
    }, []);

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
                await handleFileUpload(data.paymentId);
            } else {
                throw new Error("No se pudo crear el documento de pago");
            }
        } catch (error) {
            showErrorMessage("No se pudo crear el documento de pago");
        }
    };

    const handleFileUpload = async (paymentId: number) => {
        if (paymentDocumentForm.file) {
            const formData = new FormData();
            formData.append('file', paymentDocumentForm.file);
            formData.append('fileTypeId', "AP");
            formData.append('systemUser', user!.id?.toUpperCase());
            formData.append('paymentId', paymentId.toString());

            formData.append('companyId', params.companyId);
            formData.append('orderTypeId', params.orderTypeId);
            formData.append('period', params.period);
            formData.append('correlative', params.correlative);

            const response = await postFile.createFile(formData);
            if (response) {
                showSuccessMessage("El pago fue creado exitosamente");
            }
        } else {
            showSuccessMessage("El pago fue creado exitosamente, pero no se adjuntó ningún archivo.");
        }
    };


    const updatePaymentDocument = async (paidAmount: number, paymentDate: string, currency: string) => {
        try {
            const data = await postOrder.updatePayment(paymentIdToUpdate, {
                paidAmount,
                paymentDate,
                systemUser: user!.id,
                currency
            });

            if (data) {
                showSuccessMessage("El pago fue actualizado exitosamente");
            } else {
                throw new Error("No se pudo actualizar el documento de pago");
            }
        } catch (error) {
            showErrorMessage("No se pudo actualizar el documento de pago");
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!Boolean(paymentIdToUpdate)) {
                await createPaymentDocuments(parseFloat(paymentDocumentForm.amountPaid), paymentDocumentForm.issueDate, paymentDocumentForm.currencyValue);
            } else if (Boolean(paymentIdToUpdate) && uploadOnlyFile) {
                await handleFileUpload(paymentIdToUpdate);
            } else if (Boolean(paymentIdToUpdate) && !uploadOnlyFile) {
                await updatePaymentDocument(parseFloat(paymentDocumentForm.amountPaid), paymentDocumentForm.issueDate, paymentDocumentForm.currencyValue)
            }
        } catch (error) {
            showErrorMessage((error as Error).message);
        } finally {
            setPaymentDocumentForm(initialFormState);
            setPaymentIdToUpdate(0);
            setUploadOnlyFile(false);
            fetchData();
        }
    };

    const handlePaymentEdit = (payment: PaymentResponseI) => {
        if (payment.paymentId === paymentIdToUpdate && !uploadOnlyFile) {
            setPaymentIdToUpdate(0);
            setPaymentDocumentForm(initialFormState);
            setUploadOnlyFile(false);
        } else {
            setUploadOnlyFile(false);
            setPaymentIdToUpdate(payment.paymentId);
            setPaymentDocumentForm({
                amountPaid: payment.paidAmount.toString(),
                issueDate: payment.paymentDate.split("T")[0],
                currencyLabel: getCurrencyDescription(payment.currency),
                currencyValue: payment.currency,
                file: null
            })
        }
    }

    const handlePaymentFileSelect = (payment: PaymentResponseI) => {
        if (payment.paymentId === paymentIdToUpdate && uploadOnlyFile) {
            setPaymentIdToUpdate(0);
            setUploadOnlyFile(false);
        } else {
            setPaymentIdToUpdate(payment.paymentId);
            setUploadOnlyFile(true);
        }
    }

    const handleDeletePayment  = async (paymentId: number) => {
        try {
            await deleteOrder.payment(paymentId);
        } catch (error) {
            showErrorMessage("No se pudo eliminar el documento de pago");
        } finally {
            fetchData();
        }
    }


    return {
        paymentDocuments,
        paymentDocumentForm,
        setPaymentDocumentForm,
        handleInputFileChange,
        handleInputChange,
        onSubmit,
        handleOptionSelection,
        paymentIdToUpdate,
        handlePaymentFileSelect,
        handlePaymentEdit,
        uploadOnlyFile,
        handleDeletePayment
    }
}