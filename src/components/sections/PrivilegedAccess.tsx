import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../tables/DataTable';
import type { PrivilegedRoles } from '../../processing/types';

type Assignment = PrivilegedRoles['assignments'][number];

const assignmentCols: ColumnDef<Assignment, unknown>[] = [
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'principal', header: 'Principal' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'principal_type', header: 'Principal Type' },
];

export default function PrivilegedAccess({ data }: { data: PrivilegedRoles }) {
  if (!data.assignments.length) return null;

  return (
    <div className="space-y-6">
      <DataTable
          title="Admin Role Assignment"
          columns={assignmentCols}
          data={data.assignments}
          pageSize={10}
      />
    </div>
  );
}