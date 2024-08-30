import { OptionType } from "../types/common/inputs";

export const orderTypeOptions: OptionType[] = [
    { label: "Orden de compra", value: "O/C" },
    { label: "Orden de pago", value: "O/P" },
    { label: "Orden de servicio", value: "O/S" }
]


export const shortOrderTypeOptions: OptionType[] = [
    { label: "Compra", value: "O/C" },
    { label: "Pago", value: "O/P" },
    { label: "Servicio", value: "O/S" }
]


export const bankOptions: OptionType[] = [
    { label: "Banco de Crédito del Perú", value: "BCP" },
    { label: "BBVA Perú", value: "BBVA" },
    { label: "Scotiabank Perú", value: "SCOTIABANK" },
    { label: "Interbank", value: "INTERBANK" },
    { label: "Banco Pichincha", value: "PICHINCHA" },
    { label: "BanBif", value: "BANBIF" },
    { label: "Banco de la Nación", value: "BNACION" },
]

export const typeAccountOptions: OptionType[] = [
    { label: "Corriente", value: "CORRIENTE" },
    { label: "Detracción", value: "DETRACCION" },
]


export const currencyOptions: OptionType[] = [
    { label: "Soles", value: "PEN" },
    { label: "Dolares", value: "USD" },
    { label: "Euros", value: "EUR" }
]

export const paymentMethodOptions: OptionType[] = [
    { label: "Contado", value: "CONTADO" },
    { label: "Crédito", value: "CRÉDITO" },
    { label: "Efectivo", value: "EFECTIVO" },
    { label: "Recibo por honorarios", value: "RECIBO POR HONORARIOS" },
    { label: "Transferencia", value: "TRANSFERENCIA" },
    { label: "Cheque", value: "CHEQUE" }
]

export const taxRetentionOptions: OptionType[] = [
    { label: "IGV 18%", value: "18.00" },
    { label: "Retención 8%", value: "8.00" },
    { label: "Sin IGV", value: "false" },
]

export const yesOrNoOptions: OptionType[] = [
    { label: "Si", value: "true" },
    { label: "No", value: "false" }
]

export const perceptionOptions: OptionType[] = [
    { label: "Sin percepción", value: "" },
    { label: "1%", value: "1.00" },
    { label: "2%", value: "2.00" },
]

export const detractionOptions: OptionType[] = [
    { label: "Sin detracción", value: "" },
    { label: "4%", value: "4.00" },
    { label: "10%", value: "10.00" },
    { label: "12%", value: "12.00" },
]