"use client";
import { useState, useEffect, useMemo, useReducer } from "react"
import { useQuery } from "@apollo/client";
import { DATATABLE_LIST } from "@/services/user.query";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    // getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable
} from "@tanstack/react-table";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";


// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank
        )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
import styles from "../page.module.css";
import { Console } from "winston/lib/winston/transports";

export default function UserList() {


    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                filterFn: "equalsString" //note: normal non-fuzzy filter column - exact match required
            },
            {
                accessorKey: "first_name",
                cell: info => info.getValue(),
                filterFn: "includesStringSensitive" //note: normal non-fuzzy filter column
            },
            {
                accessorFn: row => row.last_name, //note: normal non-fuzzy filter column - case sensitive
                accessorKey: "last_name",
                cell: info => info.getValue(),
                header: () => <span>Last Name</span>,
                filterFn: "includesString" //note: normal non-fuzzy filter column - case insensitive
            },
            {
                accessorFn: row => `${row.first_name} ${row.last_name}`,
                id: "fullName",
                header: "Full Name",
                cell: info => info.getValue(),
                // filterFn: "fuzzy", //using our custom fuzzy filter function
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
    /** user definded state **/

    const [tableMeta, setTableMeta] = useState({
        totalRow: 0,
        currentPage: 1,
        totalPage: 0,
        pageSize: 5
    });

    /**end user definded state **/
    const [data, setData] = useState([]);
    // const [pagination, setPagination] = useState({
    //     pageIndex: 0, //initial page index
    //     pageSize: 5, //default page size
    // });
    useEffect(() => {
        // setPagination({
        //     ...pagination,
        //     // ["pageIndex"]: table_meta.pageNo,
        //     ["pageSize"]: tableMeta.pageSize
        // });
        table.setPageSize(Number(6))
        console.log("TABLE", table.getState().pagination.pageSize);
    }, [tableMeta])
    const PageIndex = (count) => {
        setTableMeta((oldMeta) => {
            return {
                ...oldMeta,
                ["currentPage"]: count,
            }
        });
    }
    const resultData = useQuery(DATATABLE_LIST, {
        variables: {
            "q": null,
            "pageNo": tableMeta.currentPage,
            "pageSize": tableMeta.pageSize
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
        filterFns: {
            fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
        },
        // initialState: {
        //     pagination: {
        //         pageIndex: tableMeta.currentPage - 1, //custom initial page index
        //         pageSize: tableMeta.pageSize, //custom default page size
        //     },
        // },
        // state: {
        //     columnFilters,
        //     globalFilter,

        // },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        // onPaginationChange: () => resultData.refetch(),
        // getPaginationRowModel: getPaginationRowModel(), //not needed for server-side pagination
        manualPagination: true, //turn off client-side pagination
        pageCount: tableMeta.totalPage,
        rowCount: tableMeta.totalRow,
        autoResetPageIndex: false,
        debugTable: false,
        debugHeaders: false,
        debugColumns: false
    });

    //apply the fuzzy sort if the fullName column is being filtered
    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === "fullName") {
            if (table.getState().sorting[0]?.id !== "fullName") {
                table.setSorting([{ id: "fullName", desc: false }])
            }
        }
        // table.getState().columnFilters[0]?.id
    }, [table.getState().columnFilters[0]?.id]);
    function Filter({ column }) {
        const columnFilterValue = column.getFilterValue()

        return (
            <DebouncedInput
                type="text"
                value={columnFilterValue ?? ""}
                onChange={e => console.log(e)}
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
            <input {...props} value={value} onChange={e => setValue(e.target.value)} />
        )
    }
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <div className="p-2">
                    <div>
                        <DebouncedInput
                            value={globalFilter ?? ""}
                            onChange={value => setGlobalFilter(String(value))}
                            className="p-2 font-lg shadow border border-block"
                            placeholder="Search all columns..."
                        />
                    </div>
                    <div className="h-2" />
                    <table>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
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
                                // console.log("getVisibleCells:", row.id)
                                return (

                                    < tr key={row.id} >
                                        {
                                            row.getVisibleCells().map(cell => {


                                                return (
                                                    <td key={cell.id} {...cell.column.id == 'email' ? {
                                                        onClick: (e) => console.log(row.original.id)
                                                    } : ``}>
                                                        {cell.column.id !== 'id' ? (flexRender(
                                                            cell.column.columnDef.cell, cell.getContext()
                                                        )) : parseInt(row.id) + 1}

                                                    </td>
                                                )
                                            })
                                        }
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
                            onClick={() => {
                                PageIndex(table.getState().pagination.pageIndex + 1);
                                table.setPageIndex(table.getPageCount() - 1)
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
                                /* onChange={(e) => {
                                    // resultData.refetch();
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    table.setPageIndex(page)
                                }} */
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
                            {[5, 6, 3, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>{table.getRowCount()} Row</div>


                    <pre>
                        {/* {
                            console.log("Table:", table.getRowCount())
                        } */}
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
        </main >
    );
}