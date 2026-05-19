'use client';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export function Panel({ id, title, subtitle, action, children, className }: { id?: string; title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section id={id} className={cn('rounded-lg border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur-xl sm:p-5', className)}>{(title || subtitle || action) && <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4"><div>{title && <h2 className="text-base font-semibold text-slate-100 sm:text-lg">{title}</h2>}{subtitle && <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>}</div>{action}</div>}{children}</section>;
}
export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' }) {
  const tones: Record<string, string> = { slate: 'border-white/10 bg-white/5 text-slate-200', emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300', cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300', violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300' };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}
export function StatCard({ label, value, delta, icon }: { label: string; value: string; delta?: string; icon?: ReactNode }) { return <div className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl"><div className="flex items-center justify-between gap-3 text-slate-300">{icon}<span className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span></div><div className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{value}</div>{delta && <div className="mt-2 text-sm text-cyan-300">{delta}</div>}</div>; }
export function Progress({ value, tone = 'cyan' }: { value: number; tone?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet' }) {
  const colors = { cyan: 'from-cyan-300 to-sky-400', emerald: 'from-emerald-300 to-teal-400', amber: 'from-amber-300 to-orange-400', rose: 'from-rose-300 to-red-400', violet: 'from-violet-300 to-fuchsia-400' };
  return <div className="h-2 w-full overflow-hidden rounded-full bg-white/10"><div className={cn('h-2 rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out', colors[tone])} style={{ width: `${Math.max(3, Math.min(100, value))}%` }} /></div>;
}
