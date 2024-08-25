import { OptionType } from "../types/common/inputs";

export const orderTypeOptions: OptionType[] = [
    { label: "Orden de compra", value: "O/C" },
    { label: "Orden de pago", value: "O/P" },
    { label: "Orden de servicio", value: "O/S" }
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
