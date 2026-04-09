"use client";

import { base } from "wagmi/chains";
import { useAccount, useSwitchChain } from "wagmi";

export function WrongNetworkBanner() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === base.id) return null;

  return (
    <div
      className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200"
      role="status"
    >
      <p className="font-medium">Wrong network — switch to Base for check-in.</p>
      <button
        type="button"
        className="mt-2 rounded-lg border border-amber-400/60 bg-amber-500/20 px-4 py-2 text-amber-100 active:scale-[0.98]"
        disabled={isPending}
        onClick={() => switchChain({ chainId: base.id })}
      >
        {isPending ? "Switching…" : "Switch to Base"}
      </button>
    </div>
  );
}
