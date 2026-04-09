# Convergence Field

Mobile-first **Next.js** game (“Stability Field”) with a **daily on-chain check-in** on **Base** mainnet, **wagmi** + **viem**, and **ERC-8021** builder attribution via **`ox`**.

- **Web app**: `web/` (Vercel Root Directory = `web`)
- **Contract**: `contracts/` (Foundry)

Inspired by the *feel* of narrative cyber-thrillers; original title and assets only — not affiliated with Quantic Dream.

## Quick start

```bash
cd web && npm install && npm run dev
```

`web/.env.local` includes the deployed **DailyCheckIn** address. For Vercel, set the same `NEXT_PUBLIC_*` values in Project → Environment Variables.

## Env

See `web/.env.example`. **Deployed contract (Base mainnet):** `0x096cA71ad016DAEc85765474F6ec8aaa168f56C1`. Also set `NEXT_PUBLIC_BASE_APP_ID` and `NEXT_PUBLIC_BUILDER_CODE` (`bc_…` from [base.dev](https://www.base.dev)).

## Contract

```bash
cd contracts && forge test
```

## Assets

Store listing images in `web/public/`: `app-icon.jpg` (1:1, max 1024×1024, ≤1MB), `app-thumbnail.jpg` (1.91:1, ≤1MB) for Base.dev.
