# MPP Example

A minimal working example of [MPP](https://mpp.dev) (Machine Payments Protocol) on **0G Chain**, powered by Herald Protocol.

This repo demonstrates a seller (HTTP server) charging for an API endpoint and a buyer (client) paying for it automatically — no API keys, no accounts, just on-chain settlement.

---

## What it does

- **Server** (`server.ts`): A [Hono](https://hono.dev) app with a `/weather` endpoint protected by an MPP paywall. It charges `0.00002` USDC.e per request.
- **Client** (`client.ts`): Automatically handles the `402 Payment Required` challenge, pays, and retries the request.

## How it works

1. Client requests `/weather`.
2. Server responds with `402 Payment Required` + a challenge (price, token, recipient).
3. Client pays:
   - **Push mode**: broadcasts an ERC-20 `transfer` tx and sends the tx hash.
   - **Pull mode** (default in this example): signs an ERC-3009 `TransferWithAuthorization` message; the server broadcasts it.
4. Server verifies the payment on-chain and returns the weather data with a `Payment-Receipt` header.

## Prerequisites

- [Bun](https://bun.sh) (or Node.js 18+)
- A 0G-compatible EVM wallet with:
  - **Server account**: funded with 0G native tokens (for gas when broadcasting `transferWithAuthorization` in pull mode)
  - **Client account**: funded with [USDC.e on 0G Mainnet](https://hub.0g.ai/swap?network=mainnet)

## Quick start

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MPP secret key (shared with the server)
MPP_SECRET_KEY=secret

# Server private key (also the payment recipient)
SERVER_PRIVATE_KEY=0x...

# Client private key (must hold USDC.e on 0G mainnet)
CLIENT_PRIVATE_KEY=0x...

# Optional: override the server URL
SERVER_URL=http://localhost:3000
```

> **Tip:** Generate a `MPP_SECRET_KEY` with `openssl rand -hex 32`.

### 3. Start the server

```bash
bun run server.ts
```

The server will be available at `http://localhost:3000`.

### 4. Run the client

In another terminal:

```bash
bun run client.ts
```

You should see the weather response after the client automatically pays.

---

## Project structure

```
.
├── server.ts          # Hono server with MPP paywall
├── client.ts          # MPP client that pays and fetches
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── .env.example       # Environment template
└── README.md          # This file
```

## Key dependencies

| Package | Purpose |
|---------|---------|
| `@heraldprotocol/mpp` | 0G Chain payment method for MPP |
| `mppx` | Core MPP protocol implementation (server & client) |
| `hono` | Lightweight web framework |
| `viem` | Ethereum/EVM interactions |

## Server parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `recipient` | — | Address that receives payments |
| `currency` | USDC.e | ERC-20 token contract address |
| `decimals` | `6` | Token decimals |
| `amount` | — | Default payment amount (human-readable) |
| `account` | — | Server wallet for broadcasting `transferWithAuthorization` |
| `waitForConfirmation` | `true` | Wait for on-chain confirmation before returning receipt |

## Client parameters

| Parameter | Description |
|-----------|-------------|
| `account` | Wallet account for signing transactions |
| `mode` | `'push'` (client broadcasts transfer) or `'pull'` (client signs authorization) |

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|--------------|-----|
| `402 Payment Required` loop | Client has insufficient USDC.e | Fund the client account with USDC.e on 0G Mainnet |
| Server fails to broadcast | Server account has no 0G native tokens | Fund the server account with 0G for gas |
| `Invalid signature` | Wrong chain or nonce mismatch | Ensure both client and server target 0G Mainnet (chain ID `16661`) |

## Learn more

- [MPP Specification](https://mpp.dev)
- [Herald Protocol Docs](https://docs.heraldprotocol.xyz/mpp/overview)
- [0G Chain](https://0g.ai)
