import { create } from "zustand";
import { BUILDER_TARGET } from "@/lib/blends";

/**
 * Estado da caixa de 12 potes, compartilhado entre o carrossel ("Compre agora")
 * e a área de montagem. Uma única fonte de verdade para a contagem.
 */
interface BoxStore {
  picks: Record<string, number>;
  /** Adiciona um pote. Retorna o novo total, ou null se a caixa já está cheia. */
  add: (handle: string) => number | null;
  remove: (handle: string) => void;
  clear: () => void;
}

const totalOf = (picks: Record<string, number>) =>
  Object.values(picks).reduce((sum, qty) => sum + qty, 0);

export const useBoxStore = create<BoxStore>((set, get) => ({
  picks: {},
  add: (handle) => {
    const picks = get().picks;
    if (totalOf(picks) >= BUILDER_TARGET) return null;
    const next = { ...picks, [handle]: (picks[handle] ?? 0) + 1 };
    set({ picks: next });
    return totalOf(next);
  },
  remove: (handle) =>
    set(({ picks }) => {
      const cur = picks[handle] ?? 0;
      if (cur <= 1) {
        const { [handle]: _omit, ...rest } = picks;
        return { picks: rest };
      }
      return { picks: { ...picks, [handle]: cur - 1 } };
    }),
  clear: () => set({ picks: {} }),
}));

export function boxTotal(picks: Record<string, number>): number {
  return totalOf(picks);
}
