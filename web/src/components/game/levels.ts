export type Cell =
  | "wall"
  | "floor"
  | "hazard"
  | "start"
  | "exit"
  | "shard";

export interface LevelDef {
  id: 1 | 2;
  title: string;
  subtitle: string;
  /** Visual ASCII map: # wall, . floor, S start, E exit, H hazard, * shard */
  ascii: string[];
  maxMoves: number;
  /** Optional stress countdown (seconds) */
  stressSec?: number;
}

export interface ParsedLevel {
  grid: Cell[][];
  rows: number;
  cols: number;
  start: { r: number; c: number };
  shardKeys: Set<string>;
}

const CHAR_MAP: Record<string, Cell> = {
  "#": "wall",
  ".": "floor",
  S: "start",
  E: "exit",
  H: "hazard",
  "*": "shard",
};

export function parseLevel(level: LevelDef): ParsedLevel {
  const ascii = level.ascii;
  const rows = ascii.length;
  const cols = ascii[0]?.length ?? 0;
  let start = { r: 0, c: 0 };
  const grid: Cell[][] = [];
  const shardKeys = new Set<string>();

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      const ch = ascii[r][c];
      const cell = CHAR_MAP[ch] ?? "floor";
      if (ch === "S") start = { r, c };
      const resolved = cell === "start" ? "floor" : cell;
      row.push(resolved);
      if (resolved === "shard") shardKeys.add(`${r},${c}`);
    }
    grid.push(row);
  }

  return { grid, rows, cols, start, shardKeys };
}

export const LEVELS: Record<1 | 2, LevelDef> = {
  1: {
    id: 1,
    title: "Stability breach",
    subtitle: "Reach the convergence exit. Avoid the corrupted cell.",
    ascii: [
      "#######",
      "#S....#",
      "#.H...#",
      "#...E.#",
      "#######",
    ],
    maxMoves: 18,
  },
  2: {
    id: 2,
    title: "Pressure cascade",
    subtitle: "More hazards. Limited moves. Survive the countdown.",
    ascii: [
      "#########",
      "#S......#",
      "#.H.H.H.#",
      "#..*..*.#",
      "#.H...H.#",
      "#....*..#",
      "#..E....#",
      "#########",
    ],
    maxMoves: 36,
    stressSec: 90,
  },
};
