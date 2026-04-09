"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type LevelDef,
  type ParsedLevel,
  parseLevel,
  type Cell,
} from "./levels";

type Status = "playing" | "won" | "lost";

const SWIPE_PX = 28;

interface SwipeGridProps {
  level: LevelDef;
  onWin: () => void;
}

export function SwipeGrid({ level, onWin }: SwipeGridProps) {
  const parsed: ParsedLevel = useMemo(() => parseLevel(level), [level]);
  const [player, setPlayer] = useState(() => parsed.start);
  const [moves, setMoves] = useState(0);
  const [shards, setShards] = useState(0);
  const [status, setStatus] = useState<Status>("playing");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    () => level.stressSec ?? null,
  );

  const [remainingShards, setRemainingShards] = useState(
    () => new Set(parsed.shardKeys),
  );

  useEffect(() => {
    if (status !== "playing" || secondsLeft === null) return;
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          queueMicrotask(() => setStatus("lost"));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearTimeout(id);
  }, [status, secondsLeft]);

  const tryMove = useCallback(
    (dr: number, dc: number) => {
      if (status !== "playing") return;
      const nr = player.r + dr;
      const nc = player.c + dc;
      const g = parsed.grid;
      if (nr < 0 || nc < 0 || nr >= g.length || nc >= g[0].length) return;
      const cell = g[nr][nc];
      if (cell === "wall") return;

      const nextMoves = moves + 1;
      setMoves(nextMoves);
      setPlayer({ r: nr, c: nc });

      const key = `${nr},${nc}`;
      if (remainingShards.has(key)) {
        setRemainingShards((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setShards((s) => s + 1);
      }

      if (cell === "hazard") {
        setStatus("lost");
        return;
      }
      if (cell === "exit") {
        setStatus("won");
        onWin();
        return;
      }
      if (nextMoves > level.maxMoves) {
        setStatus("lost");
      }
    },
    [player, moves, status, level.maxMoves, onWin, parsed.grid, remainingShards],
  );

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    touchStart.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!touchStart.current) return;
    const dx = e.clientX - touchStart.current.x;
    const dy = e.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.hypot(dx, dy) < SWIPE_PX) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      tryMove(0, dx > 0 ? 1 : -1);
    } else {
      tryMove(dy > 0 ? 1 : -1, 0);
    }
  }

  function cellVisual(r: number, c: number): Cell {
    const cell = parsed.grid[r][c];
    const isPlayer = player.r === r && player.c === c;
    if (isPlayer && cell === "exit") return "exit";
    if (isPlayer) return "floor";
    return cell;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative touch-none select-none rounded-xl border border-cyan-500/20 bg-black/40 p-2"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{
          aspectRatio: `${parsed.cols} / ${parsed.rows}`,
          maxHeight: "min(62vh, 520px)",
        }}
      >
        <div
          className="grid h-full w-full gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${parsed.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${parsed.rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: parsed.rows }, (_, r) =>
            Array.from({ length: parsed.cols }, (_, c) => {
              const vis = cellVisual(r, c);
              const here = player.r === r && player.c === c;
              const cls = cellClass(vis, here, r, c);
              return (
                <div key={`${r}-${c}`} className={cls}>
                  {here && (
                    <span className="shard-trail text-[10px] font-bold text-cyan-200">
                      ◆
                    </span>
                  )}
                </div>
              );
            }),
          )}
        </div>
        <p className="pointer-events-none absolute bottom-1 right-2 text-[10px] text-slate-500">
          Swipe to move
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <span className="font-mono text-cyan-200/90">
          Moves {moves}/{level.maxMoves}
        </span>
        <span className="text-fuchsia-300/90">Shards {shards}</span>
        {secondsLeft !== null && (
          <span
            className={
              secondsLeft <= 10
                ? "animate-pulse font-mono text-red-400"
                : "font-mono text-amber-200"
            }
          >
            Stress {secondsLeft}s
          </span>
        )}
      </div>

      {status === "won" && (
        <p className="text-center text-sm font-semibold text-lime-400">
          Sector stabilized. Convergence achieved.
        </p>
      )}
      {status === "lost" && (
        <p className="text-center text-sm text-red-400/90">
          {level.stressSec !== undefined && (secondsLeft ?? 1) <= 0
            ? "Time expired."
            : moves > level.maxMoves
              ? "Move limit exceeded."
              : "Corruption consumed the path. Retry."}
        </p>
      )}
      {status === "lost" && (
        <button
          type="button"
          className="rounded-lg border border-cyan-500/40 py-2 text-sm text-cyan-200"
          onClick={() => {
            setPlayer(parsed.start);
            setMoves(0);
            setShards(0);
            setStatus("playing");
            setSecondsLeft(level.stressSec ?? null);
            setRemainingShards(new Set(parsed.shardKeys));
          }}
        >
          Reset run
        </button>
      )}
    </div>
  );
}

function cellClass(vis: Cell, playerHere: boolean, r: number, c: number): string {
  const base =
    "relative flex items-center justify-center rounded-sm border text-[10px] sm:text-xs";
  const diagonal = (r + c) % 2 === 0 ? "bg-cyan-500/5" : "bg-fuchsia-500/5";
  if (playerHere) {
    return `${base} ${diagonal} border-cyan-400/60 shadow-[0_0_16px_rgba(34,211,238,0.35)]`;
  }
  switch (vis) {
    case "wall":
      return `${base} border-slate-700 bg-slate-900/90`;
    case "hazard":
      return `${base} ${diagonal} border-amber-500/50 bg-amber-500/10 shadow-[inset_0_0_12px_rgba(251,191,36,0.2)]`;
    case "exit":
      return `${base} ${diagonal} border-lime-400/60 bg-lime-500/15 shadow-[0_0_20px_rgba(163,230,53,0.25)]`;
    case "shard":
      return `${base} ${diagonal} border-fuchsia-400/40 bg-fuchsia-500/10`;
    default:
      return `${base} ${diagonal} border-cyan-500/15`;
  }
}
