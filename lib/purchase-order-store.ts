'use client';

import { useEffect, useMemo, useState } from 'react';
import { emptyPurchaseOrderDraft, normalizePurchaseOrder, seedPurchaseOrders, validatePurchaseOrder } from './purchase-orders';
import type { PurchaseOrder } from './types';

export const purchaseOrderStorageKey = 'procureflow-purchase-orders';

function readPurchaseOrders() {
  if (typeof window === 'undefined') return seedPurchaseOrders;
  const saved = window.localStorage.getItem(purchaseOrderStorageKey);
  if (!saved) return seedPurchaseOrders;
  try {
    return JSON.parse(saved) as PurchaseOrder[];
  } catch {
    return seedPurchaseOrders;
  }
}

function publishPurchaseOrders(items: PurchaseOrder[]) {
  window.localStorage.setItem(purchaseOrderStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event('procureflow-purchase-orders-updated'));
}

export function newPurchaseOrderDraft() {
  return {
    ...emptyPurchaseOrderDraft,
    items: emptyPurchaseOrderDraft.items.map((item) => ({ ...item, id: `POL-${Date.now()}-1` })),
  };
}

export function usePurchaseOrders() {
  const [items, setItems] = useState<PurchaseOrder[]>(seedPurchaseOrders);

  useEffect(() => {
    const sync = () => setItems(readPurchaseOrders());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('procureflow-purchase-orders-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('procureflow-purchase-orders-updated', sync);
    };
  }, []);

  const actions = useMemo(() => ({
    save(draft: PurchaseOrder, editingId?: string) {
      const current = readPurchaseOrders();
      const normalized = normalizePurchaseOrder(draft);
      const result = validatePurchaseOrder(normalized, current, editingId);
      if (!result.valid) return { result, item: normalized };

      const today = new Date().toISOString().slice(0, 10);
      const nextItem: PurchaseOrder = {
        ...normalized,
        id: editingId || normalized.id || `POREC-${String(Date.now()).slice(-6)}`,
        createdAt: editingId ? normalized.createdAt : today,
        updatedAt: today,
        matchingStatus: normalized.matchingStatus || 'Ready for 3-Way Match',
      };
      const nextItems = editingId ? current.map((item) => item.id === editingId ? nextItem : item) : [nextItem, ...current];
      publishPurchaseOrders(nextItems);
      setItems(nextItems);
      return { result, item: nextItem };
    },
    remove(id: string) {
      const nextItems = readPurchaseOrders().filter((item) => item.id !== id);
      publishPurchaseOrders(nextItems);
      setItems(nextItems);
    },
    reset() {
      publishPurchaseOrders(seedPurchaseOrders);
      setItems(seedPurchaseOrders);
    },
  }), []);

  return { items, ...actions };
}
