import type { InboxForwardingRules } from './types'

export function processInboxRules(data: Record<string, unknown>): InboxForwardingRules | null {
  if (!('InboxForwardingRules' in data)) return null
  const root = data.InboxForwardingRules as Record<string, unknown>
  const summary = (root.Summary as Record<string, unknown>) ?? {}
  const rules = Array.isArray(root.ForwardingRules) ? root.ForwardingRules : []

  const ruleRows = rules.map((r: any) => ({
    mailbox_upn: r.MailboxUPN,
    mailbox_display: r.MailboxDisplay,
    rule_name: r.RuleName,
    rule_enabled: Boolean(r.RuleEnabled),
    forward_type: r.ForwardType,
    forward_target: r.ForwardTarget,
    target_domain: r.TargetDomain,
    rule_priority: Number(r.RulePriority),
    rule_description: r.RuleDescription
  }))

  return {
    summary: {
      total_mailboxes_checked: Number(summary.TotalMailboxesChecked) || 0,
      total_rules_checked: Number(summary.TotalRulesChecked) || 0,
      external_forwards_found: Number(summary.ExternalForwardsFound) || 0,
      enabled_external_forwards: Number(summary.EnabledExternalForwards) || 0,
      mailboxes_with_forwards: Number(summary.MailboxesWithForwards) || 0,
      external_domains: Array.isArray(summary.ExternalDomains) ? summary.ExternalDomains as string[] : null
    },
    rules: ruleRows
  }
}
