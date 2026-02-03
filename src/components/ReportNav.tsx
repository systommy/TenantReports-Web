import { useState, useEffect } from 'react'
import type { ProcessedReport } from '../processing/types'

export default function ReportNav({ report }: { report: ProcessedReport }) {
  const [activeId, setActiveId] = useState<string>('')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveId(id)
  }

  // Optional: Update active tab on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, { rootMargin: '-100px 0px -70% 0px' })

    const ids = [
      'tenant-overview', 'user-metrics', 'compliance-overview', 'security-scores',
      'mfa-coverage', 'license-overview', 'expiring-credentials', 'conditional-access',
      'apple-mdm', 'service-principals', 'privileged-access', 'sentinel-incidents',
      'defender-summary', 'risky-users', 'mailbox-permissions', 'calendar-permissions',
      'audit-events'
    ]
    
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const sections = [
    // Overview Group
    { id: 'tenant-overview', label: 'Tenant', visible: report.tenant !== null },
    { id: 'user-metrics', label: 'Users', visible: report.users !== null },
    { id: 'compliance-overview', label: 'Compliance', visible: report.compliance !== null },
    { id: 'security-scores', label: 'Secure Score', visible: report.security !== null },
    { id: 'mfa-coverage', label: 'MFA', visible: report.mfa !== null },
    { id: 'license-overview', label: 'Licenses', visible: report.licenses !== null },
    { id: 'expiring-credentials', label: 'Expiring Creds', visible: (report.servicePrincipals?.expiring_credentials?.length ?? 0) > 0 },

    // Operations Group
    { id: 'conditional-access', label: 'Cond. Access', visible: report.conditionalAccess !== null },
    { id: 'apple-mdm', label: 'Apple MDM', visible: report.appleMdm !== null },
    { id: 'app-registration-secrets', label: 'App Secrets', visible: report.appCredentials !== null },
    { id: 'service-principals', label: 'Service Principals', visible: report.servicePrincipals !== null },
    { id: 'privileged-access', label: 'Privileged Access', visible: report.privileged !== null },
    { id: 'defender-incidents', label: 'Defender Incidents', visible: report.defenderIncidents !== null },
    { id: 'defender-summary', label: 'Defender', visible: report.defender !== null },
    { id: 'risky-users', label: 'Risky Users', visible: report.riskyUsers !== null },
    { id: 'mailbox-permissions', label: 'Mailbox Perms', visible: report.mailbox !== null },
    { id: 'calendar-permissions', label: 'Calendar Perms', visible: report.calendar !== null },
    { id: 'audit-events', label: 'Audit Events', visible: report.audit !== null },
  ]

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 overflow-x-auto no-print">
      <div className="max-w-7xl mx-auto px-4 flex gap-1 text-sm font-medium whitespace-nowrap hide-scrollbar py-1">
        {sections.filter(s => s.visible).map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`px-3 py-2 rounded-md transition-all ${
              activeId === s.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
