import { approvalTier } from '@/lib/data';
import { Badge } from './ui';
import { money } from '@/lib/utils';
export function ApprovalTier({ amount }: { amount: number }) { const tier = approvalTier(amount); return <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Approver routing</div><div className="mt-2 flex items-center justify-between gap-3"><div><div className="text-lg font-semibold text-white">{money(amount)}</div><div className="text-sm text-slate-400">Threshold auto-detects {tier.level}</div></div><Badge tone="cyan">{tier.role}</Badge></div></div>; }

