import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import DataTable from '../tables/DataTable'
import { formatDate } from '../../utils/format'
import type { ServicePrincipals } from '../../processing/types'

type Credential = ServicePrincipals['expiring_credentials'][number]

const columns: ColumnDef<Credential, unknown>[] = [
  { accessorKey: 'name', header: 'Application' },
  { accessorKey: 'app_id', header: 'App ID' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'expires_on', header: 'Expires',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
]

export default function ExpiringCredentials({ credentials }: { credentials: ServicePrincipals['expiring_credentials'] }) {
  if (!credentials || credentials.length === 0) return null

  return (
    <Section title="Expiring Credentials" id="expiring-credentials">
      <DataTable columns={columns} data={credentials} />
    </Section>
  )
}
