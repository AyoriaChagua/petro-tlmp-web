import { BiCheck, BiTrash } from "react-icons/bi"
import { Button, CheckBoxSelector, CustomSelect, IconButton, Input } from "../.."
import { useMainFilter } from "../../../hooks/useMainFilter"
import CustomDateRange from "../../UI/CustomDateRange"
import RangeAmounts from "../../UI/RangeAmounts"
import { shortOrderTypeOptions } from "../../../utils/constants"
import "./styles.css";
import { RiFileExcel2Line } from "react-icons/ri"
import { FaSearch } from "react-icons/fa"
import { OrderWithDocumentsI, ReportResponseI, ReportType } from "../../../types/reports"
import AsyncSelect from 'react-select/async';


interface Props {
  readonly children: React.ReactNode
  readonly reportType: ReportType
  readonly onSubmit: (data: OrderWithDocumentsI[] | ReportResponseI[]) => void
  readonly onExport?: () => void
  readonly documentsToExport?: []
}


export default function ReportLayout({
  children,
  documentsToExport,
  onExport,
  onSubmit,
  reportType
}: Props) {
  console.log(onExport, documentsToExport)
  const {
    handleDateRange,
    handleInputChange,
    handleInputRange,
    documentTypeOptions,
    showFilter,
    setShowFilter,
    searchOrderDocuments,
    searchDocumentReport,
    handleCheckBox,
    loadProviderOptions,
    handleOptionSelection,
    filters,
    handleExport,
    orderWithDocuments,
    clearFilter,
    handleBlurInputDocumentNumber,
    documentReport
  } = useMainFilter(reportType);


  const handleSearch = async () => {
    let data: OrderWithDocumentsI[] | ReportResponseI[] = [];
    if (reportType === "pettyCash" || reportType === "purchasing") data = await searchDocumentReport();
    else if (reportType === "general") data = await searchOrderDocuments();
    if (data) onSubmit(data);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <IconButton
          icon={showFilter ? "show" : "hide"}
          onClick={() => setShowFilter(!showFilter)}
        />
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <Button
            styleType="danger"
            text="Limpiar"
            type="button"
            onClick={clearFilter}
            icon={BiTrash}
          />
          <Button
            styleType="success"
            text="Exportar"
            type="button"
            icon={RiFileExcel2Line}
            onClick={()=>handleExport(reportType === "general" ? orderWithDocuments : documentReport)}
            disabled={orderWithDocuments.length === 0 && documentReport.length === 0}
          />
          <Button
            styleType="primary"
            text="Buscar"
            type="button"
            icon={FaSearch}
            onClick={handleSearch}
          />
        </div>
      </div>
      <div className={`filter-container ${showFilter ? 'show' : ''}`}>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 md:gap-x-20 md:gap-y-5 gap-x-5 gap-y-3  border border-gray-200 rounded-lg p-5">
          <div className="col-span-1">
            <CustomDateRange
              endDate={filters.endDate}
              startDate={filters.startDate}
              onChange={handleDateRange}
            />
          </div>
          {
            reportType === "general" &&
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor={"selectProvider"} className={"block mb-2 text-sm font-medium text-gray-600"}>RUC/DNI proveedor</label>
              <AsyncSelect
                id="selectProvider"
                placeholder="Buscar..."
                loadOptions={loadProviderOptions}
                onChange={(option) => handleOptionSelection(option, "supplierRuc")}
                cacheOptions
                defaultOptions
              />
            </div>
          }


          <div className="col-span-1 sm:col-span-2">
            <Input
              id="orderNumber"
              typeForm="create"
              placeholder="0000000000"
              label="N° de orden"
              type="number"
              maxLength={10}
              onChange={(e) => handleInputChange(e, "orderNumber")}
              value={filters.orderNumber}
              onBlur={handleBlurInputDocumentNumber}
            />
          </div>
          {reportType !== "general" &&
            <div className="col-span-1 md:col-span-2">
              <CustomSelect
                id="documentType"
                label="Tipo de comprobante"
                options={documentTypeOptions}
                onChange={(option) => handleOptionSelection(option, "documentTypeId")}
                typeForm="create"
              />
            </div>
          }
          <div className="sm:col-span-2 ">
            <RangeAmounts
              initialFrom={0}
              initialTo={100000}
              max={200000}
              min={0}
              label="Total"
              onChange={(from, to) => handleInputRange(from, to)}
            />
          </div>
          {
            reportType === "general" &&
            <div className="col-span-1 sm:col-span-2">
              <CheckBoxSelector
                onChange={handleCheckBox}
                options={shortOrderTypeOptions.map((option) => {
                  return { ...option, icon: BiCheck }
                })}
                title="Tipo de orden"
              />
            </div>
          }
        </div>
      </div>
      {children}
    </div>
  )
}
