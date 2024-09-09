import { useParams } from 'react-router-dom';
import { FolderType } from '../../types/file';
import { FolderButton } from '../../components';
import { useFileFolder } from '../../hooks/useFileFolder';

export default function FileFolder() {
    const { folderType, numberReference } = useParams<{
        folderType: FolderType;
        numberReference: string;
    }>();

    const { numberReference : numberReferenceDecrypt, orderReference } = useFileFolder(folderType!, numberReference!);

    return (
        <div className='flex flex-col gap-5'>
            <div className='font-semibold text-gray-400 text-xl'>Carpetas</div>
            <div className='flex gap-4'>
                {
                    folderType === "document" ?
                        (
                            <>
                                <FolderButton name={"Documento"} onClick={() => { }} isOpen={true} />
                                <FolderButton name={"Pagos"} onClick={() => { }} isOpen={false} />
                            </>
                        ) : (
                            <FolderButton name={"Orden"} onClick={() => { }} isOpen={true} />
                        )
                }
            </div>
            <div className='font-semibold text-gray-400 text-xl'>Archivos <span className='text-gray-500 text-base font-normal'>({folderType === "document" ? numberReferenceDecrypt : orderReference?.orderTypeId + "  #"+orderReference?.correlative })</span></div>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 bg-gray-50 rounded-xl p-5'>

            </div>
        </div>
    )
}
