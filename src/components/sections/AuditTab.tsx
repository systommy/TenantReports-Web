import type { ProcessedReport, LicenseChange } from '../../processing/types';
import AuditEvents from './AuditEvents';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../tables/DataTable';
import { Info } from 'lucide-react';

const changeColumns: ColumnDef<LicenseChange, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Date' },
  { accessorKey: 'user', header: 'Initiated By' },
  { accessorKey: 'target_user', header: 'Target User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'sku', header: 'License' },
]

export default function AuditTab({ data }: { data: ProcessedReport }) {
  const changes = data.licenseChanges;

  return (
    <div className="space-y-8">
      <AuditEvents data={data.audit} />

      <div id="license-changes" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Recent License Changes</h3>
          {changes && changes.length > 0 ? (
            <DataTable 
              title="License Change Log"
              columns={changeColumns} 
              data={changes} 
              pageSize={10} 
            />
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
                <Info size={20} />
                <span className="text-sm font-medium">No recent license changes found.</span>
            </div>
          )}
      </div>
    </div>
  );
}
