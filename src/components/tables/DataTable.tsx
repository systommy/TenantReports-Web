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
import { ChevronRight, ChevronDown, Search, ArrowUpDown, ChevronLeft } from 'lucide-react'

interface Props<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pageSize?: number
  filterPlaceholder?: string
  renderSubComponent?: (props: { row: T }) => ReactNode
  getRowCanExpand?: (row: T) => boolean
  title?: string
  actions?: ReactNode
}

export default function DataTable<T>({ 
  columns, 
  data, 
  pageSize = 10, 
  filterPlaceholder = 'Search...',
  renderSubComponent,
  getRowCanExpand,
  title,
  actions
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar: Title + Search + Actions */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex-1">
          {title && <h3 className="font-bold text-gray-900 text-sm">{title}</h3>}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative group w-full sm:w-64 no-export">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
            <input 
              type="text" 
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder={filterPlaceholder}
              className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-indigo-600 transition-colors' : ''
                    }`}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && !header.column.getIsSorted() && (
                        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-30" />
                      )}
                      {header.column.getIsSorted() && (
                        <span className="text-indigo-500">
                          {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string]}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <tr className="hover:bg-gray-50/80 transition-colors group">
                  {row.getVisibleCells().map((cell, idx) => (
                    <td key={cell.id} className="px-6 py-3 whitespace-nowrap text-gray-700">
                      <div className="flex items-center gap-2">
                        {idx === 0 && row.getCanExpand() && (
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors no-export"
                          >
                            {row.getIsExpanded() ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderSubComponent && (
                  <tr className="bg-gray-50/30">
                    <td colSpan={row.getVisibleCells().length} className="px-6 py-4 relative">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                       {renderSubComponent({ row: row.original })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 italic">
                        No results found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {(table.getPageCount() > 1 || data.length > 10) && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50 no-export">
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">
              Page <span className="font-medium text-gray-900">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-gray-900">{table.getPageCount()}</span>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="bg-white border border-gray-200 text-gray-600 text-xs rounded py-1 pl-2 pr-6 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {[10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 border border-gray-200 rounded bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}