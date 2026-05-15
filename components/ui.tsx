'use client';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export function Panel({ title, subtitle, action, children, className }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn('rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl', className)}>{(title || subtitle || action) && <div className="mb-4 flex items-start justify-between gap-4"><div>{title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}{subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}</div>{action}</div>}{children}</section>;
}
export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' }) {
  const tones: Record<string, string> = { slate: 'border-white/10 bg-white/5 text-slate-200', emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300', cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300', violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300' };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}
export function StatCard({ label, value, delta, icon }: { label: string; value: string; delta?: string; icon?: ReactNode }) { return <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl"><div className="flex items-center justify-between gap-3 text-slate-300">{icon}<span className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span></div><div className="mt-4 text-3xl font-semibold text-white">{value}</div>{delta && <div className="mt-2 text-sm text-cyan-300">{delta}</div>}</div>; }
export function Progress({ value }: { value: number }) { return <div className="h-2 w-full rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} /></div>; }
