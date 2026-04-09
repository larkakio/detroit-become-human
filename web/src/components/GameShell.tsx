"use client";

import { useState } from "react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DailyCheckInPanel } from "@/components/DailyCheckInPanel";
import { SwipeGrid } from "@/components/game/SwipeGrid";
import { LEVELS } from "@/components/game/levels";
import { useGameProgress } from "@/components/game/useGameProgress";
import { WrongNetworkBanner } from "@/components/WrongNetworkBanner";

export function GameShell() {
  const { level2Unlocked, setLevel1Complete } = useGameProgress();
  const [active, setActive] = useState<1 | 2>(1);

  const level = LEVELS[active];

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(34, 211, 238, 0.4) 2px,
            rgba(34, 211, 238, 0.4) 3px
          )`,
        }}
      />

      <WrongNetworkBanner />

      <header className="relative z-10 border-b border-cyan-500/20 bg-[#05060a]/90 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.35em] text-fuchsia-400/80">
              Convergence
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-cyan-100 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
              Stability Field
            </h1>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
              Swipe across the grid. Reach the exit. A Detroit-inspired
              cyber-thriller mini experience — English UI.
            </p>
          </div>
          <ConnectWallet />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <nav
          className="flex gap-2 rounded-2xl border border-cyan-500/15 bg-black/30 p-1"
          aria-label="Level selection"
        >
          <button
            type="button"
            onClick={() => setActive(1)}
            className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              active === 1
                ? "bg-cyan-500/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                : "text-slate-500 hover:text-cyan-200/80"
            }`}
          >
            Level 1
          </button>
          <button
            type="button"
            disabled={!level2Unlocked}
            onClick={() => setActive(2)}
            title={
              level2Unlocked
                ? "Level 2"
                : "Complete Level 1 to unlock"
            }
            className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold transition ${
              active === 2
                ? "bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.2)]"
                : level2Unlocked
                  ? "text-slate-500 hover:text-fuchsia-200/80"
                  : "cursor-not-allowed text-slate-600"
            }`}
          >
            Level 2
            {!level2Unlocked && (
              <span className="ml-1 text-[10px] text-amber-500/90">Locked</span>
            )}
          </button>
        </nav>

        <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#070a12] to-[#0c1020] p-4 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
          <h2 className="font-display text-lg text-cyan-200">{level.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{level.subtitle}</p>
          <div className="mt-4">
            <SwipeGrid
              key={active}
              level={level}
              onWin={() => {
                if (active === 1) setLevel1Complete(true);
              }}
            />
          </div>
        </section>

        <DailyCheckInPanel />

        <footer className="text-center text-[10px] text-slate-600">
          Standard web app on Base · wagmi · viem · builder attribution via ERC-8021
        </footer>
      </main>
    </div>
  );
}
