'use client';
import { useMemo, useState } from 'react';
import { Badge, Panel } from '@/components/ui';
import { useDemoUser } from '@/lib/auth';
import { useWorkflowItems, type WorkflowItem } from '@/lib/workflow-store';
import { money } from '@/lib/utils';
import { CheckCircle2, PauseCircle, Search, XCircle } from 'lucide-react';

function toneForStatus(status: WorkflowItem['status']) {
  if (status === 'Approved' || status === 'Queued for Payment' || status === 'Paid') return 'emerald';
  if (status === 'Rejected' || status === 'Payment Failed') return 'rose';
  if (status === 'On Hold') return 'amber';
  return 'cyan';
}

export default function ApprovalsPage() {
  const user = useDemoUser();
  const { items, update } = useWorkflowItems();
  const [query, setQuery] = useState('');
  const isAdmin = user.key === 'admin';
  const myRows = useMemo(() => {
    const base = isAdmin ? items : items.filter((item) => item.approvalLevel === user.level);
    return base.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
  }, [items, query, user.level, isAdmin]);
  const counts = ['L1', 'L2', 'L3'].map((level) => ({ level, count: items.filter((item) => item.approvalLevel === level).length }));

  function decide(item: WorkflowItem, status: WorkflowItem['status']) {
    const paymentStatus = status === 'Approved' ? 'Ready' : status === 'On Hold' ? 'Hold' : 'Not Ready';
    update(item.id, { status, paymentStatus }, user.role);
  }

  return <div className="space-y-5"><Panel title="Phase 4: Approval workflow" subtitle="Amount-based routing with live approve, reject, and hold actions."><div className="grid gap-3 md:grid-cols-4"><div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Logged in</div><div className="mt-2 text-lg font-semibold text-white">{user.role}</div><div className="mt-1 text-sm text-slate-400">{isAdmin ? 'All queues visible' : `${user.level} queue only`}</div></div>{counts.map((entry) => <div key={entry.level} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{entry.level} invoices</div><div className="mt-2 text-2xl font-semibold text-white">{entry.count}</div><div className="mt-1 text-sm text-slate-400">{entry.level === 'L1' ? '<= INR 10,000' : entry.level === 'L2' ? 'INR 10,001 - 1,00,000' : '> INR 1,00,000'}</div></div>)}</div></Panel><Panel><div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoice, vendor, PO, GRN, level, status..." className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/30" /></div></Panel><Panel title={`Approval table (${myRows.length})`} subtitle="Actions update the same shared workflow records used by Admin and Vendor views."><div className="overflow-auto"><table className="min-w-[1100px] w-full border-separate border-spacing-0 text-left text-sm"><thead><tr className="text-xs uppercase tracking-[0.14em] text-slate-500"><th className="border-b border-white/10 px-3 py-3">Invoice</th><th className="border-b border-white/10 px-3 py-3">Vendor</th><th className="border-b border-white/10 px-3 py-3">PO / GRN</th><th className="border-b border-white/10 px-3 py-3">Amount</th><th className="border-b border-white/10 px-3 py-3">Level</th><th className="border-b border-white/10 px-3 py-3">Match</th><th className="border-b border-white/10 px-3 py-3">Status</th><th className="border-b border-white/10 px-3 py-3">Last action</th><th className="border-b border-white/10 px-3 py-3">Action</th></tr></thead><tbody>{myRows.map((item) => <tr key={item.id} className="hover:bg-white/[0.03]"><td className="border-b border-white/5 px-3 py-4 font-medium text-white">{item.invoiceNumber}</td><td className="border-b border-white/5 px-3 py-4 text-slate-300">{item.vendorName}</td><td className="border-b border-white/5 px-3 py-4 text-slate-300">{item.poNumber} / {item.grnNumber}</td><td className="border-b border-white/5 px-3 py-4 text-slate-200">{money(item.invoiceAmount)}</td><td className="border-b border-white/5 px-3 py-4"><Badge tone={item.approvalLevel === 'L1' ? 'cyan' : item.approvalLevel === 'L2' ? 'violet' : 'amber'}>{item.approvalLevel}</Badge></td><td className="border-b border-white/5 px-3 py-4"><Badge tone={item.matchStatus === 'Matched' ? 'emerald' : item.matchStatus === 'Variance' ? 'amber' : 'slate'}>{item.matchStatus}</Badge></td><td className="border-b border-white/5 px-3 py-4"><Badge tone={toneForStatus(item.status)}>{item.status}</Badge></td><td className="border-b border-white/5 px-3 py-4 text-slate-400">{item.lastActionBy}</td><td className="border-b border-white/5 px-3 py-4"><div className="flex gap-2"><button onClick={() => decide(item, 'Approved')} className="inline-flex items-center gap-1 rounded-xl bg-emerald-300 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-200"><CheckCircle2 size={14} />Approve</button><button onClick={() => decide(item, 'Rejected')} className="inline-flex items-center gap-1 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-400/15"><XCircle size={14} />Reject</button><button onClick={() => decide(item, 'On Hold')} className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/15"><PauseCircle size={14} />Hold</button></div></td></tr>)}</tbody></table></div></Panel></div>;
}
