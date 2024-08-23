export interface TableColumn<T> {
    key: keyof T | "actions";
    label: string;
    render?: (item: T[keyof T], row: T) => React.ReactNode;
    actions?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
    columns: Array<TableColumn<T>>;
    data: T[];
}