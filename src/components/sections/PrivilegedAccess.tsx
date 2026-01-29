import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../tables/DataTable';
import StatusPill from '../common/StatusPill';
import DoughnutChart from '../charts/DoughnutChart';
import { formatDate } from '../../utils/format';
import type { PrivilegedRoles } from '../../processing/types';

type Assignment = PrivilegedRoles['assignments'][number];
type Activation = PrivilegedRoles['activations'][number];

const assignmentCols: ColumnDef<Assignment, unknown>[] = [
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'principal', header: 'Principal' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'principal_type', header: 'Principal Type' },
];

const activationCols: ColumnDef<Activation, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'activity', header: 'Activity' },
  { accessorKey: 'initiated_by', header: 'Initiated By' },
  { accessorKey: 'target_role', header: 'Target Role' },
  { 
    accessorKey: 'result', 
    header: 'Result',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'success' ? 'success' : 'danger';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    }
  },
];

export default function PrivilegedAccess({ data }: { data: PrivilegedRoles }) {
  const [showActivations, setShowActivations] = useState(false);

  if (!data.assignments.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <DataTable
            title="Global Admin Assignments"
            columns={assignmentCols}
            data={data.assignments}
            pageSize={5}
        />
        
        {data.activations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
                <button
                    className="flex items-center gap-2 text-sm font-bold text-gray-900 w-full"
                    onClick={() => setShowActivations(!showActivations)}
                >
                    {showActivations ? '▼' : '▶'} PIM Activations ({data.activations.length})
                </button>
                {showActivations && (
                    <div className="mt-4">
                        <DataTable columns={activationCols} data={data.activations} pageSize={5} />
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Role Distribution</h3>
            <DoughnutChart 
                labels={Object.keys(data.by_principal_type)} 
                values={Object.values(data.by_principal_type)} 
                title="" 
            />
        </div>
      </div>
    </div>
  );
}