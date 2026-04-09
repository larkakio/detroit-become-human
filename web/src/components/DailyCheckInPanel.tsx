"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { base } from "wagmi/chains";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { checkInAbi } from "@/lib/checkInAbi";
import { getBuilderDataSuffix } from "@/lib/builderSuffix";
import { currentUnixDay } from "@/lib/base";

const ZERO = "0x0000000000000000000000000000000000000000";

function useContractAddress(): `0x${string}` | undefined {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw || raw === ZERO) return undefined;
  return raw as `0x${string}`;
}

export function DailyCheckInPanel() {
  const queryClient = useQueryClient();
  const { address, isConnected, chainId } = useAccount();
  const contractAddress = useContractAddress();
  const { switchChainAsync, isPending: switching } = useSwitchChain();

  const { data: lastDayOnChain } = useReadContract({
    address: contractAddress,
    abi: checkInAbi,
    functionName: "lastDay",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractAddress && address) },
  });

  const { data: streak } = useReadContract({
    address: contractAddress,
    abi: checkInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contractAddress && address) },
  });

  const { writeContractAsync, isPending: writing, error: writeError } =
    useWriteContract();

  const canCheckInToday = useMemo(() => {
    if (lastDayOnChain === undefined) return true;
    return lastDayOnChain !== currentUnixDay();
  }, [lastDayOnChain]);

  const needsBase = isConnected && chainId !== base.id;

  async function handleCheckIn() {
    if (!contractAddress || !address) return;
    if (chainId !== base.id) {
      await switchChainAsync({ chainId: base.id });
    }
    const suffix = getBuilderDataSuffix();
    await writeContractAsync({
      address: contractAddress,
      abi: checkInAbi,
      functionName: "checkIn",
      chainId: base.id,
      ...(suffix ? { dataSuffix: suffix } : {}),
    });
    await queryClient.invalidateQueries();
  }

  const busy = writing || switching;
  const canSubmit =
    isConnected && canCheckInToday && contractAddress && !busy;

  if (!contractAddress) {
    return (
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-100/90">
        <h2 className="font-display text-lg text-amber-200">Daily check-in</h2>
        <p className="mt-2 text-amber-200/80">
          Set{" "}
          <code className="rounded bg-black/40 px-1 text-xs">
            NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS
          </code>{" "}
          after deploying the contract.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-lime-400/25 bg-[#070b14] p-4 shadow-[inset_0_1px_0_rgba(34,197,94,0.12)]">
      <h2 className="font-display text-lg tracking-wide text-lime-200">
        Daily on-chain check-in
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Base mainnet · gas only · builder attribution appended
      </p>

      {!isConnected ? (
        <p className="mt-3 text-sm text-slate-400">
          Connect a wallet to record your daily check-in.
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-slate-500">Streak</span>
              <span className="ml-2 font-mono text-lime-300">
                {streak !== undefined ? String(streak) : "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Status</span>
              <span className="ml-2 text-cyan-200">
                {canCheckInToday ? "Ready" : "Already checked in today"}
              </span>
            </div>
            {needsBase && (
              <div className="w-full text-xs text-amber-200/90">
                Wallet will switch to Base before signing.
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!canSubmit}
            className="mt-4 w-full rounded-xl border border-lime-400/40 bg-lime-500/10 py-3 text-sm font-semibold text-lime-100 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => void handleCheckIn()}
          >
            {busy
              ? needsBase
                ? "Switch / sign…"
                : "Signing…"
              : canCheckInToday
                ? "Check in on Base"
                : "Done for today"}
          </button>
          {writeError && (
            <p className="mt-2 text-center text-xs text-red-400">
              {writeError.message}
            </p>
          )}
        </>
      )}
    </section>
  );
}
