# Convergence Field

Mobile-first **Next.js** game (“Stability Field”) with a **daily on-chain check-in** on **Base** mainnet, **wagmi** + **viem**, and **ERC-8021** builder attribution via **`ox`**.

- **Web app**: `web/` (Vercel Root Directory = `web`)
- **Contract**: `contracts/` (Foundry)

Inspired by the *feel* of narrative cyber-thrillers; original title and assets only — not affiliated with Quantic Dream.

## Quick start

```bash
cd web && npm install && npm run dev
```

**Production:** [https://detroit-become-human.vercel.app](https://detroit-become-human.vercel.app)  
`web/.env.local` is gitignored; copy from `web/.env.example` if needed. In Vercel → Environment Variables, set the same `NEXT_PUBLIC_*` values (including builder code for transaction attribution).

## Env

See `web/.env.example`. **Deployed contract (Base mainnet):** `0x096cA71ad016DAEc85765474F6ec8aaa168f56C1`. **Base app ID:** `69d75f3dfefa3ff9b6fdafc9`. **Builder code:** `bc_b3fxh43o` ([base.dev](https://www.base.dev) → Settings → Builder Code).

## Contract

```bash
cd contracts && forge test
```

## Assets

Store listing images in `web/public/`: `app-icon.jpg` (1:1, max 1024×1024, ≤1MB), `app-thumbnail.jpg` (1.91:1, ≤1MB) for Base.dev.
