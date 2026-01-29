import { useState, type ReactNode } from 'react'

export default function Section({ title, id, children, defaultOpen = true }: { title: string; id: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section id={id} className="mb-10 scroll-mt-20 print-break">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
        <button 
          onClick={() => setOpen(!open)} 
          className="no-print p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
          title={open ? "Collapse section" : "Expand section"}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </button>
      </div>
      {open && <div className="animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </section>
  )
}
