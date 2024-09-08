export const splitVoucher = (input: string): [string, string] => {
    const match = input.split('-');
    if (match) {
        return [match[0], match[1]];
    }
    throw new Error('El formato del string es incorrecto');
}



export const formatCurrency = (amount: number): string => {
    const roundedAmount = Math.round(amount * 100) / 100;
    const [integerPart, decimalPart = ''] = roundedAmount.toString().split('.');
    const formatIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedDecimalPart = decimalPart.padEnd(2, '0');
    return `${formatIntegerPart}.${formattedDecimalPart}`;
}


