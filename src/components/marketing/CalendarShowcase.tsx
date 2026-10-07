"use client";

import { Reveal } from "@/components/marketing/Reveal";
import { gradientForSeed } from "@/lib/utils/gradient";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const FILLED_CELLS = new Set([2, 5, 9, 12, 13, 16, 19, 22, 26, 29]);

export function CalendarShowcase() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Um calendário editorial que dá vontade de usar.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Visualize por mês, semana ou dia. Arraste e solte para reorganizar sua agenda de
            publicações.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-elevated)">
            <div className="grid grid-cols-7 border-b border-border bg-surface-elevated">
              {WEEKDAYS.map((d) => (
                <div key={d} className="p-2 text-center text-[11px] font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0"
                >
                  <span className="text-[10px] text-muted-foreground/60">{i + 1}</span>
                  {FILLED_CELLS.has(i) && (
                    <div
                      className="h-3 flex-1 rounded-xs"
                      style={{ background: gradientForSeed(`showcase-${i}`) }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
