import { Button, IconButton, Input, Loader, MaintananceLayout, Pagination, Table } from "../../../components";
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
    currentPage,
    handlePageChange,
    sunatDocumentChunks
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
      <div className="flex flex-col justify-between h-full">
        <Table<SunatDocumentI> columns={columns} data={sunatDocuments} />
        <br />
        <Pagination
          totalPages={sunatDocumentChunks.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
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
