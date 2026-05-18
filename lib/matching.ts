import type { WorkflowItem } from './workflow-store';

export type MatchQuality = 'high' | 'partial' | 'variance';

function clamp(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function scoreFromVariance(actual: number, expected: number) {
  if (expected === 0) return actual === 0 ? 100 : 0;
  return clamp(100 - (Math.abs(actual - expected) / Math.abs(expected)) * 100);
}

export function calculateMatchScore(item: WorkflowItem) {
  const amountScore = scoreFromVariance(item.invoiceAmount, item.poAmount);
  const quantityScore = scoreFromVariance(item.grnQty, item.poQty);
  const documentScore = [item.poNumber, item.grnNumber, item.challanNumber, item.invoiceNumber].filter(Boolean).length * 25;
  const weighted = amountScore * 0.48 + quantityScore * 0.34 + documentScore * 0.18;
  const score = Math.round(clamp(weighted));
  const quality: MatchQuality = score >= 90 ? 'high' : score >= 70 ? 'partial' : 'variance';
  const amountVariance = item.invoiceAmount - item.poAmount;
  const qtyVariance = item.grnQty - item.poQty;

  return {
    score,
    quality,
    amountScore: Math.round(amountScore),
    quantityScore: Math.round(quantityScore),
    documentScore,
    amountVariance,
    qtyVariance,
    label: item.matchStatus === 'Variance' ? `Variance Detected: ${score}% Match` : item.matchStatus === 'Pending' ? `Pending: ${score}% Match` : `Matched: ${score}%`,
  };
}

export function matchTone(quality: MatchQuality) {
  if (quality === 'high') return 'emerald' as const;
  if (quality === 'partial') return 'amber' as const;
  return 'rose' as const;
}
