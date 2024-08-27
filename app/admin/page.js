"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from "@apollo/client"
import styles from "../page.module.css";
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
import { DATATABLE_LIST } from "@/services/user.query";






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
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <>
            <input {...props} value={value}
                onChange={e => setValue(e.target.value)}
            />

        </>
    )
}
function SelectOpt(value) {
    const bpaChange = () => {

    }

    return (<>
        <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
        >
            <option key={``} value={``}>select</option>
            <option key={`a`} value={`Ak`}>Adesh kumar</option>
            <option key={`b`} value={`Bk`}>Bipin kumar</option>
            {/* {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))} */}
        </select>
    </>)
}

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
    const ref = useRef(null)

    useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + " cursor-pointer"}
            {...rest}
        />
    )
}

export default function DeliveryList() {

    // const rerender = useReducer(() => ({}), {})[1]

    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

    const columns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    </div>
                ),
            },
            {
                accessorKey: "select-row",
                header: () => ``,
                enableColumnFilter: false,
            },
            {
                accessorKey: "id",
                header: () => <span>S.NO</span>,
                // filterFn: "equalsString" //note: normal non-fuzzy filter column - exact match required
            },
            {
                accessorKey: "first_name",
                cell: info => info.getValue(),
                header: () => <span>First Name</span>,
                filterFn: "includesStringSensitive" //note: normal non-fuzzy filter column
            },
            {
                accessorFn: row => row.last_name, //note: normal non-fuzzy filter column - case sensitive
                id: "last_name",
                cell: info => info.getValue(),
                header: () => <span>Last Name</span>,
                filterFn: "includesString" //note: normal non-fuzzy filter column - case insensitive
            },
            {
                accessorFn: row => `${row.first_name} ${row.last_name}`,
                id: "fullName",
                header: "Full Name",
                cell: info => info.getValue(),
                header: () => <span>Full Name</span>,
                //   filterFn: "fuzzy", //using our custom fuzzy filter function
                filterFn: fuzzyFilter, //or just define with the function
                sortingFn: fuzzySort //sort by fuzzy rank (falls back to alphanumeric)
            },
            {
                accessorFn: row => row.email, //note: normal non-fuzzy filter column - case sensitive
                accessorKey: "email",
                cell: info => info.getValue(),
                header: () => <span>Email Address</span>,
                filterFn: "includesString" //note: normal non-fuzzy filter column - case insensitive
            },
        ],
        []
    )

    const [data, setData] = useState([]);//() => makeData(5_000)
    /** user definded state **/
    const [rowSelection, setRowSelection] = useState({})
    const [tableMeta, setTableMeta] = useState({
        totalRow: 0,
        currentPage: 1,
        totalPage: 0,
        pageSize: 5,
        filterCols: []
    });
    const resultData = useQuery(DATATABLE_LIST, {
        variables: {
            "pageNo": tableMeta.currentPage,
            "pageSize": tableMeta.pageSize,
            "filter": JSON.stringify(columnFilters)
        },
        onCompleted: (dataset) => {
            // console.log(dataset.UserList.datatable)//pagination
            const { datatable, table_meta } = dataset.UserList;
            setData(datatable);
            setTableMeta((oldMeta) => {
                return {
                    ...oldMeta,
                    ["totalRow"]: table_meta.totalRow,
                    // ["currentPage"]: 1,
                    ["totalPage"]: table_meta.totalPage
                }
            });
            // setPagination({
            //     ...pagination,
            //     ["pageIndex"]: table_meta.pageNo,
            //     ["pageSize"]: table_meta.pageSize
            // });
        },
        onError: () => {

        }
    })

    const table = useReactTable({
        data,
        columns,
        getRowId: row => row.id,
        filterFns: {
            fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
        },
        state: {
            rowSelection,
            columnFilters,
            globalFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(), //client side filtering
        enableRowSelection: true,
        getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        pageCount: tableMeta.totalPage,
        rowCount: tableMeta.totalRow,

        onRowSelectionChange: setRowSelection,

        manualFiltering: true,
        manualPagination: true, //turn off client-side pagination
        debugTable: true,
        debugHeaders: true,
        debugColumns: false
    })

    //apply the fuzzy sort if the fullName column is being filtered
    useEffect(() => {
        console.log("makeData:-", table.getState())
        if (table.getState().columnFilters[0]?.id === "fullName") {
            if (table.getState().sorting[0]?.id !== "fullName") {
                table.setSorting([{ id: "fullName", desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    return (
        <main className={styles.main}>
            <div className={styles.description}>

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
                                                <tr key={headerGroup.id} className={`text-start text-gray-800 fw-bold fs-7 gs-0     `}>
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
                                                                                {/* {console.log(header.column.id)} */}
                                                                                {header.column.id === 'last_name' ? <SelectOpt value="a" /> : <Filter column={header.column} />}

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
                                                    <tr key={row.id} className={row.getIsSelected() ? 'selected' : null} onClick={row.getToggleSelectedHandler()}>
                                                        {row.getVisibleCells().map(cell => {
                                                            return (
                                                                <td key={cell.id} {...cell.column.id == 'email' ? {
                                                                    onClick: (e) => console.log(row.original.id)
                                                                } : ``}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                    {/*  {cell.column.id !== 'id' ? (flexRender(
                                                                        cell.column.columnDef.cell, cell.getContext()
                                                                    )) : parseInt(row.id) + 1} */}
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
                                            onClick={() => {
                                                table.setPageIndex(0);
                                                setTableMeta((oldPage) => {
                                                    return {
                                                        ...oldPage,
                                                        ["currentPage"]: 1
                                                    }
                                                });
                                            }}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            {"<<"}
                                        </button>
                                        <button
                                            className="border rounded p-1"
                                            onClick={() => {
                                                setTableMeta((oldPage) => {
                                                    return {
                                                        ...oldPage,
                                                        ["currentPage"]: table.getState().pagination.pageIndex
                                                    }
                                                }); table.previousPage()
                                            }}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            {"<"}
                                        </button>
                                        <button
                                            className="border rounded p-1"
                                            onClick={() => {
                                                table.nextPage();
                                                const page = table.getState().pagination.pageIndex + 2;
                                                setTableMeta((oldPage) => {
                                                    return {
                                                        ...oldPage,
                                                        ["currentPage"]: page
                                                    }
                                                });
                                                table.setPageIndex(page - 1);
                                            }}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            {">"}
                                        </button>
                                        <button
                                            className="border rounded p-1"
                                            onClick={() => {
                                                table.setPageIndex(table.getPageCount() - 1);
                                                setTableMeta((oldPage) => {
                                                    return {
                                                        ...oldPage,
                                                        ["currentPage"]: table.getPageCount()
                                                    }
                                                });
                                            }}
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
                                                onKeyDown={(e) => {

                                                    if (e.key === 'Enter') {
                                                        // alert('Enter... (KeyPress, use charCode)');
                                                        setTableMeta((oldPage) => {
                                                            return {
                                                                ...oldPage,
                                                                ["currentPage"]: parseInt(e.target.value)
                                                            }
                                                        })
                                                        table.setPageIndex(parseInt(e.target.value))
                                                        // console.log(e.target.value)
                                                    }
                                                }}
                                                className="border p-1 rounded w-16"
                                            />
                                        </span>
                                        <select
                                            value={tableMeta.pageSize}
                                            onChange={e => {
                                                setTableMeta((oldMeta) => {
                                                    return {
                                                        ...oldMeta,
                                                        ["pageSize"]: Number(e.target.value),
                                                    }
                                                });

                                            }}
                                        >
                                            {[5, 3, 10, 20, 25].map(pageSize => (
                                                <option key={pageSize} value={pageSize}>
                                                    Show {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>{table.getRowCount()} Rows</div>
                                    {/* 
<div>
<button onClick={() => rerender()}>Force Rerender</button>
</div>
<div>
<button onClick={() => refreshData()}>Refresh Data</button>
</div> */}
                                    <pre>
                                        {JSON.stringify(rowSelection)}
                                        {JSON.stringify(
                                            {
                                                columnFilters: table.getState().columnFilters,
                                                globalFilter: table.getState().globalFilter
                                            },
                                            null,
                                            2
                                        )}
                                    </pre>
                                    <div>
                                        {Object.keys(rowSelection).length} of{" "}
                                        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}