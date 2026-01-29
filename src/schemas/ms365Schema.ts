import { z } from 'zod'

export const ms365Schema = z.object({
  ReportMetadata: z.object({
    TenantId: z.string(),
    TenantName: z.string(),
    GeneratedDate: z.string(),
  }).passthrough(),
  TenantInfo: z.object({
    Summary: z.object({}).passthrough(),
  }).passthrough(),
  Users: z.object({
    Summary: z.object({}).passthrough(),
  }).passthrough(),
  SecureScore: z.object({}).passthrough(),
}).passthrough()

export type MS365Data = z.infer<typeof ms365Schema>
