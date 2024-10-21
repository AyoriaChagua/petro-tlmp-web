export interface ExchangeRateResponseI {
    date: Date
    purchase_price: number
    sale_price: number
}

export interface ExchangeRatePaginationI {
    quantity: number
    exchangeRates: ExchangeRateResponseI[]
}