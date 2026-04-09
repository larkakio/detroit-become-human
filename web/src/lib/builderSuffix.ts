import { Attribution } from "ox/erc8021";
import type { Hex } from "viem";

/** Returns ERC-8021 calldata suffix for builder attribution, or undefined if not configured. */
export function getBuilderDataSuffix(): Hex | undefined {
  const override = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (override?.startsWith("0x")) return override as Hex;

  const code = process.env.NEXT_PUBLIC_BUILDER_CODE?.trim();
  if (!code) return undefined;

  return Attribution.toDataSuffix({ codes: [code] });
}
