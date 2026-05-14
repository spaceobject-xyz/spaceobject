# @heraldprotocol/mpp

0G Chain payment method for the [Machine Payments Protocol](https://mpp.dev).

> **Warning:** This package is under active development.

## Install

```bash
npm install @heraldprotocol/mpp mppx viem
```

## Features

- **Charge** — One-time ERC-20 token transfers. Supports push mode (client broadcasts) and pull mode (server broadcasts via ERC-3009).
- **0G Mainnet** — Pre-configured for USDC.e on 0G Mainnet (`16661`).

## Usage

### Server

```ts
import { Mppx } from "mppx/server";
import { zerog } from "@heraldprotocol/mpp/server";

const mppx = Mppx.create({
  methods: [
    zerog.charge({
      recipient: "0x...", // address that receives payments
      currency: "0x...",  // ERC-20 token contract address
    }),
  ],
});
```

### Client

```ts
import { Mppx } from "mppx/client";
import { zerog } from "@heraldprotocol/mpp/client";
import { privateKeyToAccount } from "viem/accounts";

const mppx = Mppx.create({
  methods: [
    zerog.charge({
      account: privateKeyToAccount("0x..."),
    }),
  ],
});
```

## Exports

| Path | Description |
|------|-------------|
| `@heraldprotocol/mpp` | Base method definition (`charge`) |
| `@heraldprotocol/mpp/client` | Client-side charge with `createCredential` |
| `@heraldprotocol/mpp/server` | Server-side charge with `verify` |

## Client Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account` | `Account \| Address` | Wallet account for signing transactions |
| `getClient` | `(params) => Client` | Custom viem client resolver by chain ID |
| `mode` | `'push' \| 'pull'` | `push`: client broadcasts an ERC-20 transfer (default for JSON-RPC accounts). `pull`: client signs an ERC-3009 `TransferWithAuthorization` for the server to submit (default for local accounts) |

## Server Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `recipient` | `string` | — | Address that receives payments |
| `currency` | `string` | USDC.e | ERC-20 token contract address |
| `decimals` | `number` | `6` | Token decimals |
| `amount` | `string` | — | Default payment amount (human-readable, e.g. "1.50") |
| `description` | `string` | — | Human-readable description |
| `externalId` | `string` | — | External identifier to echo back in receipt |
| `getClient` | `(params) => Client` | Built-in | Custom viem client resolver by chain ID |
| `testnet` | `boolean` | `false` | Use testnet chain ID (no default currency; must pass `currency`) |
| `waitForConfirmation` | `boolean` | `true` | Wait for on-chain confirmation before returning receipt |
| `account` | `Account \| Address` | — | Server wallet for broadcasting `transferWithAuthorization` transactions. Required when accepting `authorization` payloads (the server pays gas from this account). Does not need to match the recipient address |
| `store` | `Store` | In-memory | Store for authorization signature replay protection. Use a shared store (e.g. Redis) in multi-instance deployments so consumed signatures are visible across all server instances |

## Example

A complete Hono server and client demo is in [`example/`](./example).

```bash
# 1. Copy the env file and fill in your private keys
cp example/.env.example example/.env

# 2. Start the server
bun run example/server.ts

# 3. In another terminal, run the client
bun run example/client.ts
```

The server account broadcasts `transferWithAuthorization` transactions and pays gas, so it must be funded with 0G native tokens. The client account must be funded with USDC.e.

## Specification

The formal protocol specification is available at [`spec/draft-0g-charge-00.md`](./spec/draft-0g-charge-00.md).

## How It Works

1. Server issues a `402 Payment Required` challenge via `mppx` with method `zerog` and intent `charge`.
2. Client creates a credential based on the mode:
   - **Push mode**: Client broadcasts an ERC-20 `transfer(to, amount)` transaction and returns the tx hash.
   - **Pull mode**: Client signs an ERC-3009 `TransferWithAuthorization` and returns the signature. Server calls `transferWithAuthorization` to execute the transfer and pay gas.
3. Server verifies the payment matches the challenge (amount, recipient, currency).
4. Server returns a `Payment-Receipt` header on success.

## License

MIT
