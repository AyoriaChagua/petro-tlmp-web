export const formatDate1 = (input: string): string => {
    const [year, month, day] = input.split('-');
    return `${day}-${month}-${year}`;
}


export const getFirstDayOfCurrentMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}