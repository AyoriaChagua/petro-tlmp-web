import { useParams } from 'react-router-dom';
import { FileDownloadCard, FileUpload, FolderButton } from '../../components';
import { useFileFolder } from '../../hooks/useFileFolder';

export default function FileFolder() {
    const { numberReference } = useParams<{ numberReference: string; }>();

    const {
        orderReference,
        handleSubmit,
        filesMP,
        handleDeleteFile,
        setFolderType,
        folderType
    } = useFileFolder(numberReference!);

    return (
        <div className='flex flex-col gap-5'>
            <div className='font-semibold text-gray-400 text-xl'>Carpetas</div>
            <div className='flex gap-4'>
                <FolderButton name={"Orden"} onClick={() => setFolderType("order")} isOpen={folderType === "order"} />
                <FolderButton name={"Documento"} onClick={() => setFolderType("document")} isOpen={folderType === "document"} />
            </div>
            <div className='font-semibold text-gray-400 text-xl'>
                Archivos
                <span className='text-gray-500 text-base font-normal'>
                    ({orderReference?.orderTypeId + "  #" + orderReference?.correlative})
                </span>
            </div>
            <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-2'>
                <div className="lg:col-span-4 md:col-span-2 col-span-1 flex gap-2 flex-wrap bg-gray-100 rounded-lg p-5 ">
                    {filesMP.length > 0 ?
                        filesMP.map(file =>
                            <FileDownloadCard key={file.id} fileMP={file} onDelete={() => handleDeleteFile(file.id)} />
                        ) :
                        <div className='text-center m-auto text-xl text-gray-500 font-medium'>Sin archivos</div>
                    }
                </div>
                {!(folderType === "payment") &&
                    <div className="lg:col-span-2 md:col-span-1 col-span-1 flex  flex-col gap-2 bg-gray-100 rounded-lg p-5 flex-wrap">
                        <FileUpload
                            onSubmit={handleSubmit}
                            fileTypeId={folderType === "document" ? "AF" : "AO"}
                        />
                    </div>
                }
            </div>
        </div>
    )
}
