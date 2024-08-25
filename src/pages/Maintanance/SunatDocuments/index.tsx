import { Button, IconButton, Input, Loader, MaintananceLayout, Table } from "../../../components";
import { useSunatDocument } from "../../../hooks/useSunatDocument"
import { TableColumn } from "../../../types/common/table";
import { SunatDocumentI, SunatDocumentRequestI } from "../../../types/sunat-document";


export default function SunatDocuments() {
  const {
    sunatDocuments,
    isLoading,
    handleDeleteSunatDocument,
    handleInputSunatDocument,
    handleSelectSunatDocument,
    idSunatDocumentToUpdate,
    onSubmit,
    sunatDocumentRequest,
    sunatDocumentChunks,
    handleSelectChunk
  } = useSunatDocument();

  const columns: TableColumn<SunatDocumentI>[] = [
    { key: "documentTypeId", label: "Código sistema" },
    { key: "sunatCode", label: "Código Sunat" },
    { key: "description", label: "Descripción" },
    {
      key: "actions", label: "Acciones", actions: (row) => (
        <div className="flex flex-row gap-3">
          <IconButton icon="edit" isSelected={idSunatDocumentToUpdate === row.documentTypeId} onClick={() => handleSelectSunatDocument(idSunatDocumentToUpdate !== row.documentTypeId ? row : null)} />
          <IconButton icon="delete" isSelected onClick={() => handleDeleteSunatDocument(row.documentTypeId)} />
        </div>
      )
    }
  ];

  if (isLoading) return <Loader />;
  return (
    <MaintananceLayout title="Tipos de documento Sunat">
      <div className="flex flex-col gap-4">
        <Table<SunatDocumentI> columns={columns} data={sunatDocuments} />
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-base h-10">
            {
              sunatDocumentChunks.map((_, index) => (
                <li>
                  <button type="button" onClick={() => handleSelectChunk(index)} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">{index + 1}</button>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
      <form onSubmit={onSubmit} className="flex w-full flex-col">
        <Input
          id="sunatDocumentIdSystem"
          label="Código Sistema:"
          typeForm="maintanance"
          className="flex flex-col w-full"
          value={(sunatDocumentRequest as SunatDocumentRequestI).documentTypeId}
          onChange={(e) => handleInputSunatDocument(e.target.value, "documentTypeId")}
          required={true}
          disabled={idSunatDocumentToUpdate ? true : false}
          maxLength={5}
        />
        <Input
          id="sunatDocumentIdSunat"
          label="Código Sunat:"
          typeForm="maintanance"
          className="flex flex-col w-full"
          value={(sunatDocumentRequest as SunatDocumentRequestI).sunatCode}
          onChange={(e) => handleInputSunatDocument(e.target.value, "sunatCode")}
          required={true}
          maxLength={10}
        />
        <Input
          id="sunatDocumentDescription"
          label="Descripción:"
          typeForm="maintanance"
          className="flex flex-col w-full"
          value={(sunatDocumentRequest as SunatDocumentRequestI).description}
          onChange={(e) => handleInputSunatDocument(e.target.value, "description")}
          required={true}
        />
        <Button text={idSunatDocumentToUpdate ? "Actualizar" : "Crear"} type="submit" styleType="form" />
      </form>
    </MaintananceLayout>
  )
}
