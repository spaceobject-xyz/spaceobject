<div align="center">
  <img width="80%" height="auto" src="assets/heraldprotocol.png" />

  <hr/>
  
  <p align="center">
    <a href="https://heraldprotocol.xyz/"><img alt="Website" src="https://img.shields.io/badge/website-heraldprotocol.xyz-1a1a1a" /></a>
    <a href="https://docs.heraldprotocol.xyz/"><img alt="Docs" src="https://img.shields.io/badge/docs-read%20the%20docs-blue" /></a>
    <a href="https://x.com/herald_protocol"><img alt="X" src="https://img.shields.io/twitter/follow/herald_protocol" /></a>
  </p>
</div>

## Herald Protocol

Herald Protocol is the infrastructure for the **agentic economy on 0G Chain**.

AI agents need to pay and get paid without humans in the loop. Herald ships the economic rails so agents can transact with other agents, APIs, and services natively on 0G.

## Live on 0G Mainnet

### x402

**Agent payments are live on 0G Chain**, powered by [x402](https://x402.org/) as the first supported rail. Any API, MCP server, or AI agent can accept onchain payments through our facilitator — no middlemen, no off-chain escrow, just HTTP + settlement on 0G.
- **Facilitator URL**: https://facilitator.heraldprotocol.xyz/
- **Supported token**: USDC.e — swap via [hub.0g.ai](https://hub.0g.ai/) or Any ERC20 token via Uniswap `Permit2`
- **Drop-in compatible with the x402 spec** — plug it into any HTTP server or agent client

Quickstart: https://docs.heraldprotocol.xyz/x402/quickstart-for-sellers

### MPP

Provides a native [MPP](https://mpp.dev/) payment method for 0G Chain, so agents can transact via MPP protocol with ERC20 tokens on 0G Chain.
- **JS SDK**: [@heraldprotocol/mpp](https://www.npmjs.com/package/@heraldprotocol/mpp)
- **Supported token**: USDC.e (via pull mode) or Any ERC20 token (via push mode)
- **Drop-in compatible with the MPP spec**

Quickstart: https://docs.heraldprotocol.xyz/mpp/quickstart-for-sellers

### Payment Router

Not every service accepts payment on 0G. The Herald Router bridges that gap: agents hold funds on 0G and pay any x402 or MPP protected service across supported routes, without juggling multiple chains or bridging manually.

Read more: https://docs.heraldprotocol.xyz/router/overview

## Architecture

### x402 / MPP Payment Flow

```
👤 User Request
      │
      ▼
🔒 402 Payment Required  ◄──── Seller (API / MCP server)
      │
      ▼
💳 Pay with USDC (via x402 or MPP)
      │
      │
      ▼
✅ Receive Data
```

The client attaches a signed payment to its request; the **facilitator** or server verifies the signature and settles the transfer on-chain before the seller unlocks the resource.

### Router Flow

```
👤 User Request
      │
      ▼
🔀 Router Proxies  (Herald Router)
      │
      ▼
🌐 402 + Map Networks
      │
      ├── 0G ── Base ── Arbitrum ── Solana ── Stellar ── …
      │
      ▼
💸 Pay & Forward
      │  Agent's funds on 0G; Router handles cross-chain payment
      ▼
✅ Receive Data
```

The Router lets an agent hold funds on 0G and pay any x402 or MPP protected service across supported chains — no manual bridging.

## 0G Chain Integration

Herald Protocol is built on **0G Chain** as the settlement layer. Currently only the 0G Chain component is in use:

| Component | Role | Problem it solves |
|---|---|---|
| **0G Chain** | Settlement layer | Sub-second finality lets micropayments settle before an HTTP response times out |
| **ERC-3009** | Off-chain token authorization | Payer signs a transfer off-chain; the facilitator or server submits the single on-chain tx, so no separate approval step is needed |
| **Uniswap Permit2** | Universal token approval router | Allows any ERC-20 (beyond USDC) via a single Permit2 signature |

## Why 0G?

0G is an EVM-compatible L1 with sub-second finality, decentralized storage, and a compute marketplace — a natural home for agent-native apps. Herald gives those agents the economic rails to transact and get paid from day one.

## Tech Stack

| Tool | Purpose |
|---|---|
| **Bun** | Package manager & runtime |
| **TypeScript** | Language |
| **Turbo** | Monorepo task orchestration |
| **Biome** | Linting & formatting |
| **tsup** | SDK bundler |
| **Wrangler** | Cloudflare Workers deployment (facilitator, router) |
| **Husky** | Git hooks |

## Scripts

Run from the project root:

| Script | Description |
|---|---|
| `bun run build` | Build all packages |
| `bun run dev` | Start all packages in dev mode |
| `bun run typecheck` | Type-check all packages |
| `bun run lint` | Lint all packages |

The [`examples/`](./examples) directory contains runnable reference implementations.

## Links

- Website: https://heraldprotocol.xyz
- Docs: https://docs.heraldprotocol.xyz
- X: https://x.com/herald_protocol
