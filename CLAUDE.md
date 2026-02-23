# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Client-side React app that visualizes MS365 security data from PowerShell JSON exports. All processing happens in the browser — no backend, no data leaves the client. This is the interactive companion to the parent `security_report` Python project; both consume the same JSON schema.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:5173
npm run build        # Type-check (tsc -b) + Vite production build to dist/
npm run lint         # ESLint on all TS/TSX files
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to GitHub Pages via gh-pages
```

No test runner is configured.

## Architecture

### Data Flow

```
JSON file drop (FileUploader) → Zod validation (ms365Schema) → raw state in App
  → useReportData hook (useMemo) → processAll() → ProcessedReport object
  → Tab components consume typed report via props
```

`App.tsx` toggles between `FileUploader` and `ReportViewer` based on whether `rawData` is set.

### Processing Pipeline

`src/processing/index.ts` orchestrates ~20 processor functions that each:
1. Accept the full raw `Record<string, unknown>` data object
2. Defensively extract nested JSON paths (heavy use of `??` and optional chaining)
3. Return a typed result or `null`

All processors are pure functions. The `ProcessedReport` type in `src/processing/types.ts` defines all 23 output interfaces — every field is nullable to handle missing data gracefully.

### Component Hierarchy

- **Layout**: `MainLayout` wraps `Header` + `Sidebar` + content area
- **Tabs** (6): Dashboard, Identity/Access, Endpoint, Exchange, SecurityOps, AuditLogs — each in `src/components/sections/`
- **Reusable**: `DataTable` (TanStack React Table with sort/filter/pagination/expandable rows), `BarChart`/`DoughnutChart`/`LineChart` (Chart.js wrappers), `StatusPill`, `ExpandableStatCard`

### Export

- **PDF**: Triggers `window.print()` with print-specific CSS
- **HTML**: Clones DOM, converts `<canvas>` to `<img>` via `toDataURL()`, extracts all CSS rules, produces standalone HTML file for download
- **Scope**: Can export current tab or all tabs (renders all tabs temporarily when exporting all)

### Schema Validation

`src/schemas/ms365Schema.ts` uses Zod with `.passthrough()` on all objects — validates required top-level keys exist while allowing new fields for forward compatibility.

## Key Conventions

- Every `ProcessedReport` field is `T | null` — components must handle missing data
- Processing functions never throw; they return `null` on bad input
- Tab components receive the full `ProcessedReport` and destructure what they need
- Tailwind CSS v4 for styling (configured via Vite plugin, not PostCSS)
- Icons from `lucide-react`
- `TabId` type in `src/components/layout/Sidebar.tsx` defines the valid tab identifiers
- Vite cache directory is set to `os.tmpdir()/vite-security-report` to avoid OneDrive sync issues

## Tech Stack

React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + TanStack React Table v8 + Chart.js 4 + Zod 4

## Relationship to Parent Project

The parent `security_report/` Python project generates static HTML reports server-side via Jinja2 and supports multiple data sources (MS365, Guardey, AutoTask, WithSecure). This web app is a single-source (MS365 JSON only) interactive alternative. Both read the same JSON format produced by a PowerShell collection tool.
