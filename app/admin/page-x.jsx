"use client";
import * as React from 'react';
import { useQuery } from "@apollo/client"
import { gql } from "graphql-tag";

import {
    // Column,
    // ColumnDef,

    // FilterFn,
    // SortingFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable,
    createColumnHelper
} from '@tanstack/react-table';
import { fuzzyFilter, fuzzySort, defaultData } from "./lib-table";
export const DELIVERY_LIST = gql`
  query GetDeliveryData($q: String, $pageNo: Int!, $pageSize: Int!) {
    getDelivery(q: $q, PageNo: $pageNo, PageSize: $pageSize){   
          pagination {
              PageNo
              TotalRow
              recordsFiltered
          }
          datatable {
              id
              CaseId
              Hospital
              Bpa
              Payer
              Mrd
              PatientName
              Doa
              Dod
              MobileNo
              Policy
              Uhid
              CorporateName
              EmpId
              TreatmentDesc
              DocAttached
              PaAmt
              BillAmt
              Doctor
              PreauthType
              ClaimAl
              RoomFee
              InvestigationFee
              IcuFee
              OtFee
              ConsultationFee
              MedicineFee
              OtherFee
              AlAmt
              AlNo
              ClaimNo
              Esm
              Relation
              StayDays
              FileNo
              CoPay
              Discount
              NpAmt
              Deduction
              DiffWithAl
              BillNo
              IpdNo      
              updatedAt
              Claim {
                  IsRecieved
                  RecievedRemark
                  RecievedDate
              }
              parentdata {
                  BpaName
                  Payer
                  FullName
              }
          }
        }
       
      }
  `;


const columnHelper = createColumnHelper()



function Filter({ column }) {
    const columnFilterValue = column.getFilterValue()

    return (
        <DebouncedInput
            type="text"
            value={columnFilterValue ?? ""}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            className="w-36 border shadow rounded"
        />
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export default function DeliveryList() {

    const rerender = React.useReducer(() => ({}), {})[1]

    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "id",
                header: () => <span>S.NO</span>,
                filterFn: "equalsString" //note: normal non-fuzzy filter column - exact match required
            },
            {
                accessorKey: "firstName",
                cell: info => info.getValue(),
                header: () => <span>Case Id</span>,
                filterFn: "includesStringSensitive" //note: normal non-fuzzy filter column
            },
            {
                accessorFn: row => row.lastName, //note: normal non-fuzzy filter column - case sensitive
                id: "lastName",
                cell: info => info.getValue(),
                header: () => <span>Patient Name</span>,
                filterFn: "includesString" //note: normal non-fuzzy filter column - case insensitive
            },
            {
                accessorFn: row => `${row.firstName} ${row.lastName}`,
                id: "fullName",
                header: "Full Name",
                cell: info => info.getValue(),
                header: () => <span>Bpa Name</span>,
                //   filterFn: "fuzzy", //using our custom fuzzy filter function
                filterFn: fuzzyFilter, //or just define with the function
                sortingFn: fuzzySort //sort by fuzzy rank (falls back to alphanumeric)
            },

        ],
        []
    )

    const [data, setData] = React.useState(defaultData);//() => makeData(5_000)
    const deliveryResult = useQuery(DELIVERY_LIST, {
        variables: {
            "q": null,
            "pageNo": 1,
            "pageSize": 10
        },

    })

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
        },
        state: {
            columnFilters,
            globalFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false
    })

    //apply the fuzzy sort if the fullName column is being filtered
    React.useEffect(() => {
        console.log("makeData:-", table.getState())
        if (table.getState().columnFilters[0]?.id === "fullName") {
            if (table.getState().sorting[0]?.id !== "fullName") {
                table.setSorting([{ id: "fullName", desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    return (
        <div>

            <div
                id="kt_content_container"
                className="d-flex flex-column-fluid align-items-start  container-xxl "
                data-select2-id="select2-data-kt_content_container"
            ><div
                className="content flex-row-fluid"
                id="kt_content"
                data-select2-id="select2-data-kt_content"
            >
                    <div className="card card-flush" data-select2-id="select2-data-140-i60y">
                        <div className="card-body pt-0">

                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer"
                            >

                                <div>
                                    <DebouncedInput
                                        value={globalFilter ?? ""}
                                        onChange={value => setGlobalFilter(String(value))}
                                        className="p-2 font-lg shadow border border-block"
                                        placeholder="Search all columns..."
                                    />
                                </div>
                                <div className="h-2" />
                                <table className="">
                                    <thead>

                                        {table.getHeaderGroups().map(headerGroup => (
                                            // TableHead(headerGroup);
                                            <tr key={headerGroup.id} className="text-start text-gray-800 fw-bold fs-7 gs-0">
                                                {headerGroup.headers.map(header => {
                                                    return (
                                                        <th key={header.id} colSpan={header.colSpan}>
                                                            {header.isPlaceholder ? null : (
                                                                <>
                                                                    <div
                                                                        {...{
                                                                            className: header.column.getCanSort()
                                                                                ? "cursor-pointer select-none"
                                                                                : "",
                                                                            onClick: header.column.getToggleSortingHandler()
                                                                        }}
                                                                    >
                                                                        {flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                        {{
                                                                            asc: " 🔼",
                                                                            desc: " 🔽"
                                                                        }[header.column.getIsSorted()] ?? null}
                                                                    </div>
                                                                    {header.column.getCanFilter() ? (
                                                                        <div>
                                                                            <Filter column={header.column} />
                                                                        </div>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map(row => {
                                            return (
                                                <tr key={row.id}>
                                                    {row.getVisibleCells().map(cell => {
                                                        return (
                                                            <td key={cell.id}>
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="h-2" />
                                <div className="flex items-center gap-2">
                                    <button
                                        className="border rounded p-1"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        {"<<"}
                                    </button>
                                    <button
                                        className="border rounded p-1"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        {"<"}
                                    </button>
                                    <button
                                        className="border rounded p-1"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        {">"}
                                    </button>
                                    <button
                                        className="border rounded p-1"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        {">>"}
                                    </button>
                                    <span className="flex items-center gap-1">
                                        <div>Page</div>
                                        <strong>
                                            {table.getState().pagination.pageIndex + 1} of{" "}
                                            {table.getPageCount()}
                                        </strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        | Go to page:
                                        <input
                                            type="number"
                                            defaultValue={table.getState().pagination.pageIndex + 1}
                                            onChange={e => {
                                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                                table.setPageIndex(page)
                                            }}
                                            className="border p-1 rounded w-16"
                                        />
                                    </span>
                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => {
                                            table.setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {[10, 20, 30, 40, 50].map(pageSize => (
                                            <option key={pageSize} value={pageSize}>
                                                Show {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
                                {/* 
<div>
<button onClick={() => rerender()}>Force Rerender</button>
</div>
<div>
<button onClick={() => refreshData()}>Refresh Data</button>
</div> */}
                                <pre>
                                    {JSON.stringify(
                                        {
                                            columnFilters: table.getState().columnFilters,
                                            globalFilter: table.getState().globalFilter
                                        },
                                        null,
                                        2
                                    )}
                                </pre>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}