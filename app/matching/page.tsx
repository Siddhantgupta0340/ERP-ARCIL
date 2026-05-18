'use client';

import { useMemo } from 'react';
import { Badge, Panel, Progress } from '@/components/ui';
import { useToast } from '@/components/toast';
import { calculateMatchScore, matchTone } from '@/lib/matching';
import { useWorkflowItems } from '@/lib/workflow-store';
import { money } from '@/lib/utils';
import { CheckCircle2, GitBranch, PlayCircle } from 'lucide-react';

export default function MatchingPage() {
  const { items } = useWorkflowItems();
  const toast = useToast();
  const scoredItems = useMemo(() => items.map((item) => ({ item, score: calculateMatchScore(item) })), [items]);
  const averageScore = Math.round(scoredItems.reduce((sum, row) => sum + row.score.score, 0) / Math.max(1, scoredItems.length));

  function runMatching() {
    const varianceCount = scoredItems.filter((row) => row.item.matchStatus === 'Variance' || row.score.quality === 'variance').length;
    toast({
      type: varianceCount ? 'warning' : 'success',
      title: 'Matching Completed',
      description: `${averageScore}% average match across ${scoredItems.length} records. ${varianceCount} variance item${varianceCount === 1 ? '' : 's'} flagged.`,
    });
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Phase 3: 3-way matching"
        subtitle="PO details, GRN/delivery challan, and invoice details are scored before approval."
        action={<button onClick={runMatching} className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"><PlayCircle size={16} /> Run check</button>}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-4">
            <GitBranch className="text-cyan-300" size={20} />
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">Average match</div>
            <div className="mt-2 text-2xl font-semibold text-white">{averageScore}%</div>
            <div className="mt-3"><Progress value={averageScore} tone={matchTone(averageScore >= 90 ? 'high' : averageScore >= 70 ? 'partial' : 'variance')} /></div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4"><div className="text-xs uppercase tracking-[0.18em] text-emerald-300">High match</div><div className="mt-2 text-2xl font-semibold text-white">{scoredItems.filter((row) => row.score.quality === 'high').length}</div></div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4"><div className="text-xs uppercase tracking-[0.18em] text-amber-300">Partial match</div><div className="mt-2 text-2xl font-semibold text-white">{scoredItems.filter((row) => row.score.quality === 'partial').length}</div></div>
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4"><div className="text-xs uppercase tracking-[0.18em] text-rose-300">High variance</div><div className="mt-2 text-2xl font-semibold text-white">{scoredItems.filter((row) => row.score.quality === 'variance').length}</div></div>
        </div>
      </Panel>

      <Panel title="PO / GRN / Invoice comparison table" subtitle="Matching percentages update automatically when workflow data changes.">
        <div className="overflow-auto">
          <table className="min-w-[1220px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="border-b border-white/10 px-3 py-3">Invoice</th>
                <th className="border-b border-white/10 px-3 py-3">PO amount / qty</th>
                <th className="border-b border-white/10 px-3 py-3">GRN qty</th>
                <th className="border-b border-white/10 px-3 py-3">Invoice amount</th>
                <th className="border-b border-white/10 px-3 py-3">Amount variance</th>
                <th className="border-b border-white/10 px-3 py-3">Qty variance</th>
                <th className="border-b border-white/10 px-3 py-3">Match score</th>
                <th className="border-b border-white/10 px-3 py-3">Outcome</th>
                <th className="border-b border-white/10 px-3 py-3">Hold needed</th>
                <th className="border-b border-white/10 px-3 py-3">Next route</th>
              </tr>
            </thead>
            <tbody>
              {scoredItems.map(({ item, score }) => (
                <tr key={item.id} className="transition hover:bg-white/[0.03]">
                  <td className="border-b border-white/5 px-3 py-4 font-medium text-white">{item.invoiceNumber}<div className="text-xs text-slate-500">{item.vendorName}</div></td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{money(item.poAmount)} / {item.poQty}</td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{item.grnQty}</td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-200">{money(item.invoiceAmount)}</td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{money(score.amountVariance)}<div className="text-xs text-slate-500">{score.amountScore}% amount score</div></td>
                  <td className="border-b border-white/5 px-3 py-4 text-slate-300">{score.qtyVariance}<div className="text-xs text-slate-500">{score.quantityScore}% qty score</div></td>
                  <td className="border-b border-white/5 px-3 py-4">
                    <div className="min-w-[190px]">
                      <div className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-white">{score.label}</span><Badge tone={matchTone(score.quality)}>{score.score}%</Badge></div>
                      <Progress value={score.score} tone={matchTone(score.quality)} />
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={item.matchStatus === 'Matched' ? 'emerald' : item.matchStatus === 'Variance' ? 'amber' : 'slate'}>{item.matchStatus}</Badge></td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={item.matchStatus === 'Variance' || score.quality === 'variance' ? 'amber' : 'emerald'}>{item.matchStatus === 'Variance' || score.quality === 'variance' ? 'Yes' : 'No'}</Badge></td>
                  <td className="border-b border-white/5 px-3 py-4"><Badge tone={item.approvalLevel === 'L1' ? 'cyan' : item.approvalLevel === 'L2' ? 'violet' : 'amber'}>{item.approvalLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        {scoredItems.slice(0, 6).map(({ item, score }) => (
          <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-glow">
            <div className="flex items-start justify-between gap-3">
              <div><div className="font-semibold text-white">{item.invoiceNumber}</div><div className="mt-1 text-xs text-slate-500">{item.vendorName}</div></div>
              <CheckCircle2 size={18} className={score.quality === 'high' ? 'text-emerald-300' : score.quality === 'partial' ? 'text-amber-300' : 'text-rose-300'} />
            </div>
            <div className="mt-4"><Progress value={score.score} tone={matchTone(score.quality)} /></div>
            <div className="mt-2 text-sm text-slate-300">{score.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
