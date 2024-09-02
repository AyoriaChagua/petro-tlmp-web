export const formatDate1 = (input: string): string => {
    const [year, month, day] = input.split('-');
    return `${day}-${month}-${year}`;
}

export const formatDate2 = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export const getFirstDayOfCurrentMonth = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

export const convertStringToDate1 = (dateString: string): Date => {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    return new Date(year, month, day);
}