"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {isConnected && address ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-cyan-200/90 sm:text-sm">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-200"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-cyan-400/50 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.25)] active:scale-[0.98]"
          >
            Connect wallet
          </button>
          {open && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
              role="dialog"
              aria-modal="true"
              onClick={() => setOpen(false)}
            >
              <div
                className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-cyan-500/30 bg-[#060912] p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="mb-3 text-center text-sm text-slate-400">
                  Choose a wallet
                </p>
                <ul className="flex flex-col gap-2">
                  {connectors.map((c) => (
                    <li key={c.uid}>
                      <button
                        type="button"
                        className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-left text-cyan-100"
                        disabled={isPending}
                        onClick={() => {
                          reset();
                          connect(
                            { connector: c },
                            {
                              onSuccess: () => setOpen(false),
                            },
                          );
                        }}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {error && (
                  <p className="mt-2 text-center text-xs text-red-400">
                    {error.message}
                  </p>
                )}
                <button
                  type="button"
                  className="mt-4 w-full py-2 text-sm text-slate-500"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
