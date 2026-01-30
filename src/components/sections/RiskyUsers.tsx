import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { RiskyUser } from '../../processing/types'

const columns: ColumnDef<RiskyUser, unknown>[] = [
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'risk_level', header: 'Risk Level',
    cell: ({ getValue }) => {
      const v = (getValue() as string)?.toLowerCase();
      const intent = v === 'high' ? 'danger' : v === 'medium' ? 'warning' : 'info';
      return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  {
    accessorKey: 'risk_state', header: 'State',
    cell: ({ getValue }) => {
       const v = String(getValue() ?? '');
       const intent = v.toLowerCase() === 'atrisk' ? 'danger' : 'neutral';
       return <StatusPill label={v} intent={intent} />
    },
  },
  { accessorKey: 'last_updated', header: 'Last Updated', cell: ({ getValue }) => formatDate(getValue() as string) },
]

export default function RiskyUsers({ data }: { data: RiskyUser[] }) {
  const summary = useMemo(() => {
    const s = { total: data.length, high: 0, medium: 0, low: 0 }
    for (const u of data) {
      const level = (u.risk_level || '').toLowerCase()
      if (level === 'high') s.high++
      else if (level === 'medium') s.medium++
      else if (level === 'low') s.low++
    }
    return s
  }, [data])

  if (!data.length) {
      return (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <div className="text-gray-500 font-medium">No risky users detected</div>
            <div className="text-xs text-gray-400 mt-1">Identity Protection did not flag any users as risky.</div>
        </div>
      )
  }

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Risky Users</div>
            <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">High Risk</div>
            <div className="text-2xl font-bold text-rose-600">{summary.high}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Medium Risk</div>
            <div className="text-2xl font-bold text-amber-600">{summary.medium}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Low Risk</div>
            <div className="text-2xl font-bold text-blue-600">{summary.low}</div>
        </div>
      </div>
      <DataTable 
        title="Risky Users List"
        columns={columns} 
        data={data} 
        renderSubComponent={({ row }) => (
            <div className="text-sm">
                <div className="font-semibold text-gray-500 mb-1">Details</div>
                <div className="text-gray-900">
                    {/* Assuming no 'detail' field in RiskyUser based on type def, but if there was: */}
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(row, null, 2)}</pre>
                </div>
            </div>
        )}
      />
    </div>
  )
}
