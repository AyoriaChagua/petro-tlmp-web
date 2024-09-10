import React, { useCallback, useState } from 'react'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { postFile } from '../../../api/file/post';
import { FileTypeMP } from '../../../types/common/inputs';
import { showErrorMessage, showSuccessMessage } from '../../../utils/alerts';
import { useAuth } from '../../../context/AuthContext';


interface Props {
    readonly fileTypeId: FileTypeMP;
    readonly onSubmit?: (files: File[], fileTypeId: FileTypeMP) => Promise<void>
}


export default function FileUpload({
    fileTypeId,
    onSubmit
}: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (files.length === 0) return;
        setUploading(true);

        if (onSubmit) {
            onSubmit(files, fileTypeId).then(() => {
                setFiles([]);
                setUploading(false);
            }).catch((error) => {
                showErrorMessage((error as Error).message);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div
                {...getRootProps()}
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Suelta los archivos aquí...</p>
                ) : (
                    <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar</p>
                )}
            </div>
            {files.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Archivos seleccionados:</h4>
                    <ul className="list-disc pl-5">
                        {files.map((file) => (
                            <li key={file.name} className="text-sm text-gray-600">
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                type="submit"
                disabled={files.length === 0 || uploading}
                className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold ${files.length === 0 || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                {uploading ? 'Subiendo...' : 'Subir archivos'}
            </button>
        </form>
    );
}