interface Props {
    readonly id: string;
    readonly label: string;
    readonly onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readonly value?: string;
}

export default function Textarea({ id, label, onChange, value }: Props) {
    return (
        <div className="flex w-full flex-col">
            <label htmlFor={id} className="block mb-2 text-lg font-medium text-gray-500">
                {label}
            </label>
            <textarea
                id={id}
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alguna observación?... "
                onChange={onChange}
                value={value}
            />
        </div>
    );
}