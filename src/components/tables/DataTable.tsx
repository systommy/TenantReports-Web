import { useState, Fragment, type ReactNode } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ExpandedState,
} from '@tanstack/react-table'

interface Props<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pageSize?: number
  filterPlaceholder?: string
  renderSubComponent?: (props: { row: T }) => ReactNode
  getRowCanExpand?: (row: T) => boolean
}

export default function DataTable<T>({ 
  columns, 
  data, 
  pageSize = 10, 
  filterPlaceholder = 'Search...',
  renderSubComponent,
  getRowCanExpand
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, expanded },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: row => getRowCanExpand ? getRowCanExpand(row.original) : !!renderSubComponent,
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {data.length > pageSize && (
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <input
            type="text"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={filterPlaceholder}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full max-w-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-gray-200">
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700 hover:bg-gray-100 transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-gray-400">
                          {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string]}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <tr className="hover:bg-blue-50/30 transition-colors group">
                  {row.getVisibleCells().map((cell, idx) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="flex items-center gap-2">
                        {idx === 0 && row.getCanExpand() && (
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            {row.getIsExpanded() ? '▼' : '▶'}
                          </button>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderSubComponent && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={row.getVisibleCells().length} className="px-6 py-4">
                      {renderSubComponent({ row: row.original })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-900">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-gray-900">{table.getPageCount()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
