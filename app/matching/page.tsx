'use client';

import { useMemo } from 'react';
import { Badge, Panel } from '@/components/ui';
import { useToast } from '@/components/toast';
import { evaluateWorkflowMatch, matchBadgeTone, matchStatusLabel } from '@/lib/matching';
import { useWorkflowItems } from '@/lib/workflow-store';
import { money } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, GitBranch, PlayCircle } from 'lucide-react';

export default function MatchingPage() {
  const { items } = useWorkflowItems();
  const toast = useToast();
  const comparedItems = useMemo(() => items.map((item) => ({ item, result: evaluateWorkflowMatch(item) })), [items]);
  const matchedCount = comparedItems.filter((row) => row.result.status === 'Matched').length;
  const varianceCount = comparedItems.length - matchedCount;

  function runMatching() {
    toast({
      type: varianceCount ? 'warning' : 'success',
      title: 'Matching Completed',
      description: `${matchedCount} matched and ${varianceCount} variance item${varianceCount === 1 ? '' : 's'} found.`,
    });
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Phase 3: 3-way matching"
        subtitle="PO, GRN/delivery challan, and invoice details are compared for quantity, price, references, and terms."
        action={<button onClick={runMatching} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"><PlayCircle size={16} /> Run validation</button>}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4">
            <GitBranch className="text-cyan-300" size={20} />
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Records checked</div>
            <div className="mt-2 text-2xl font-semibold text-white">{comparedItems.length}</div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4"><CheckCircle2 className="text-emerald-300" size={20} /><div className="mt-2 text-xs uppercase tracking-[0.18em] text-emerald-300">Matched</div><div className="mt-2 text-2xl font-semibold text-white">{matchedCount}</div></div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4"><AlertTriangle className="text-amber-300" size={20} /><div className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-300">Variance detected</div><div className="mt-2 text-2xl font-semibold text-white">{varianceCount}</div></div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Approval impact</div><div className="mt-2 text-sm leading-6 text-slate-300">Matched invoices continue. Variance invoices stay available for review before approval.</div></div>
        </div>
      </Panel>

      <Panel title="PO / GRN / Invoice comparison" subtitle="Status and variance details only. Mismatched fields are highlighted for review.">
        <div className="overflow-auto">
          <table className="min-w-[1220px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="border-b border-white/10 px-3 py-3">Invoice</th>
                <th className="border-b border-white/10 px-3 py-3">PO details</th>
                <th className="border-b border-white/10 px-3 py-3">GRN / challan</th>
                <th className="border-b border-white/10 px-3 py-3">Invoice details</th>
                <th className="border-b border-white/10 px-3 py-3">Status</th>
                <th className="border-b border-white/10 px-3 py-3">Variance details</th>
                <th className="border-b border-white/10 px-3 py-3">Review</th>
                <th className="border-b border-white/10 px-3 py-3">Next route</th>
              </tr>
            </thead>
            <tbody>
              {comparedItems.map(({ item, result }) => (
                <tr key={item.id} className="transition hover:bg-white/[0.03]">
                  <td className="border-b border-white/5 px-3 py-4 font-medium text-white">{item.invoiceNumber}<div className="text-xs text-slate-500">{item.vendorName}</div></td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{item.poNumber}<div className="text-xs text-slate-500">{money(item.poAmount)} | Qty {item.poQty}</div></td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{item.grnNumber}<div className="text-xs text-slate-500">{item.challanNumber} | Qty {item.grnQty}</div></td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-200">{money(item.invoiceAmount)}<div className="text-xs text-slate-500">GST {money(item.gstAmount)}</div></td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={matchBadgeTone(result.status)}>{result.status}</Badge><div className="mt-2 text-xs text-slate-500">Recorded: {matchStatusLabel(item.matchStatus)}</div></td>
                  <td className="border-b border-white/5 px-3 py-4">
                    {result.variances.length ? (
                      <div className="flex min-w-[260px] flex-wrap gap-2">
                        {result.variances.map((variance, index) => <Badge key={`${variance.field}-${index}`} tone={variance.severity === 'critical' ? 'rose' : 'amber'}>{variance.field}</Badge>)}
                      </div>
                    ) : <span className="text-slate-400">No variance found</span>}
                  </td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={result.variances.length ? 'amber' : 'emerald'}>{result.variances.length ? 'Review required' : 'Ready'}</Badge></td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={item.approvalLevel === 'L1' ? 'cyan' : item.approvalLevel === 'L2' ? 'violet' : 'amber'}>{item.approvalLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        {comparedItems.slice(0, 6).map(({ item, result }) => (
          <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-glow">
            <div className="flex items-start justify-between gap-3">
              <div><div className="font-semibold text-white">{item.invoiceNumber}</div><div className="mt-1 text-xs text-slate-500">{item.vendorName}</div></div>
              {result.status === 'Matched' ? <CheckCircle2 size={18} className="text-emerald-300" /> : <AlertTriangle size={18} className="text-amber-300" />}
            </div>
            <div className="mt-4"><Badge tone={matchBadgeTone(result.status)}>{result.status}</Badge></div>
            <div className="mt-3 text-sm leading-6 text-slate-400">{result.variances.length ? result.variances.map((variance) => variance.field).join(', ') : 'PO, GRN, and invoice details are consistent.'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
