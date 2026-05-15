'use client';

import { Badge, Panel } from '@/components/ui';
import { demoData } from '@/lib/data';
import { money } from '@/lib/utils';
import { CheckCircle2, FileText, XCircle } from 'lucide-react';

function dateOnly(value: string) {
  return value.slice(0, 10);
}

function invoiceOutcome(invoice: (typeof demoData.invoices)[number]) {
  if (invoice.validationStatus === 'Pass' && invoice.erpSyncStatus === 'Synced') {
    return { tone: 'emerald' as const, label: 'Success', message: 'Invoice validated and synced successfully.' };
  }
  if (invoice.validationStatus === 'Fail' || invoice.erpSyncStatus === 'Failed') {
    return { tone: 'rose' as const, label: 'Failure', message: invoice.holdReason || 'Validation or ERP sync failed.' };
  }
  return { tone: 'amber' as const, label: 'Warning', message: 'Invoice needs review before final posting.' };
}

export default function InvoicesPage() {
  const invoices = demoData.invoices.slice(0, 50);
  const successCount = invoices.filter((invoice) => invoiceOutcome(invoice).label === 'Success').length;
  const failureCount = invoices.filter((invoice) => invoiceOutcome(invoice).label === 'Failure').length;
  const totalValue = invoices.reduce((sum, invoice) => sum + invoice.grossAmount, 0);

  return (
    <div className="space-y-5">
      <Panel title="Phase 2: Invoice processing" subtitle="All invoice page with 50 filled invoice records, validation results, and success/failure messages.">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Invoices shown</div><div className="mt-2 text-2xl font-semibold text-white">{invoices.length}</div></div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Gross value</div><div className="mt-2 text-2xl font-semibold text-white">{money(totalValue)}</div></div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"><div className="text-xs uppercase tracking-[0.18em] text-emerald-300">Success</div><div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white"><CheckCircle2 size={22} className="text-emerald-300" />{successCount}</div></div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4"><div className="text-xs uppercase tracking-[0.18em] text-rose-300">Failure</div><div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white"><XCircle size={22} className="text-rose-300" />{failureCount}</div></div>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-300" />
          Successful invoices have passed validation and are synced to ERP.
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          <XCircle size={20} className="shrink-0 text-rose-300" />
          Failed invoices show the reason so AP can correct GST, vendor, or ERP issues.
        </div>
      </div>

      <Panel title="Invoice validation table" subtitle="50 populated invoices with vendor, tax, PO/GRN, validation, ERP, and success/failure result.">
        <div className="overflow-auto">
          <table className="min-w-[1500px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                <th className="border-b border-white/10 px-3 py-3">Invoice</th>
                <th className="border-b border-white/10 px-3 py-3">Dates</th>
                <th className="border-b border-white/10 px-3 py-3">Vendor</th>
                <th className="border-b border-white/10 px-3 py-3">Amount</th>
                <th className="border-b border-white/10 px-3 py-3">Tax</th>
                <th className="border-b border-white/10 px-3 py-3">PO / GRN</th>
                <th className="border-b border-white/10 px-3 py-3">Department</th>
                <th className="border-b border-white/10 px-3 py-3">Validation</th>
                <th className="border-b border-white/10 px-3 py-3">Approval</th>
                <th className="border-b border-white/10 px-3 py-3">ERP</th>
                <th className="border-b border-white/10 px-3 py-3">Result message</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const outcome = invoiceOutcome(invoice);
                return (
                  <tr key={invoice.id} className="hover:bg-white/[0.03]">
                    <td className="border-b border-white/5 px-3 py-4 font-medium text-white">{invoice.invoiceNumber}<div className="text-xs text-slate-500">{invoice.invoiceType} | {invoice.source}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-300">Issue {dateOnly(invoice.issueDate)}<div className="text-xs text-slate-500">Due {dateOnly(invoice.dueDate)}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-300">{invoice.vendorName}<div className="text-xs text-slate-500">{invoice.vendorGstin}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-200">{money(invoice.grossAmount)}<div className="text-xs text-slate-500">Sub {money(invoice.subtotal)}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-300">GST {money(invoice.gstAmount)}<div className="text-xs text-slate-500">TDS {money(invoice.tdsAmount)}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-300">{invoice.poNumber}<div className="text-xs text-slate-500">{invoice.grnNumber}</div></td>
                    <td className="border-b border-white/5 px-3 py-4 text-slate-300">{invoice.department}<div className="text-xs text-slate-500">{invoice.costCenter} | {invoice.glCode}</div></td>
                    <td className="border-b border-white/5 px-3 py-4"><Badge tone={invoice.validationStatus === 'Pass' ? 'emerald' : invoice.validationStatus === 'Fail' ? 'rose' : 'amber'}>{invoice.validationStatus}</Badge><div className="mt-2 text-xs text-slate-500">OCR {invoice.ocrConfidence}%</div></td>
                    <td className="border-b border-white/5 px-3 py-4"><Badge tone={invoice.approvalLevel === 'L1' ? 'cyan' : invoice.approvalLevel === 'L2' ? 'violet' : invoice.approvalLevel === 'L3' ? 'amber' : 'slate'}>{invoice.approvalLevel}</Badge><div className="mt-2 text-xs text-slate-500">{invoice.approvalStatus}</div></td>
                    <td className="border-b border-white/5 px-3 py-4"><Badge tone={invoice.erpSyncStatus === 'Synced' ? 'emerald' : invoice.erpSyncStatus === 'Failed' ? 'rose' : 'slate'}>{invoice.erpSyncStatus}</Badge><div className="mt-2 text-xs text-slate-500">Retries {invoice.retryCount}</div></td>
                    <td className="border-b border-white/5 px-3 py-4">
                      <div className="flex items-start gap-2">
                        {outcome.label === 'Success' ? <CheckCircle2 size={17} className="mt-0.5 text-emerald-300" /> : outcome.label === 'Failure' ? <XCircle size={17} className="mt-0.5 text-rose-300" /> : <FileText size={17} className="mt-0.5 text-amber-300" />}
                        <div><Badge tone={outcome.tone}>{outcome.label}</Badge><div className="mt-2 max-w-[260px] text-xs text-slate-400">{outcome.message}</div></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
