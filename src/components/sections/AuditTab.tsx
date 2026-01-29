import type { ProcessedReport } from '../../processing/types';
import AuditEvents from './AuditEvents';

export default function AuditTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      <AuditEvents data={data.audit} />
    </div>
  );
}
