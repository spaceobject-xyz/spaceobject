# x402 Permit2 Example

This example demonstrates how to use **x402 with Permit2** on 0G Mainnet, enabling payments with **any ERC-20 token** — not just tokens that natively support EIP-3009 (`transferWithAuthorization`).

## What This Example Shows

- **Server**: Advertises both `eip2612GasSponsoring` and `erc20ApprovalGasSponsoring` extensions, enabling gasless Permit2 onboarding for any ERC-20 token.
- **Client**: Uses `toClientEvmSigner` with a `publicClient` to provide the `signTransaction`, `getTransactionCount`, and `estimateFeesPerGas` capabilities required for ERC-20 approval gas sponsoring.

## How It Works

1. The server advertises the ERC-20 approval gas sponsoring extension in the `PaymentRequired` response.
2. The client checks if the token's Permit2 allowance is sufficient.
3. If not, and the token doesn't support EIP-2612, the client signs (but does not broadcast) a raw `approve(Permit2, MaxUint256)` transaction.
4. The client includes the signed transaction in the payment payload.
5. The facilitator broadcasts the approval and settles the payment in an atomic batch.

## Running the Example

### Prerequisites

- A 0G Mainnet RPC URL (set as `ZEROG_RPC_URL`)
- A private key with some gas tokens (set as `ZEROG_PRIVATE_KEY`)
- A recipient address (set as `ZEROG_RECIPIENT_ADDRESS`)

### Start the Server

```bash
bun run server.ts
```

The server will start on `http://localhost:3000`.

### Run the Client

```bash
bun run client.ts
```

The client will automatically handle the payment and fetch the weather data.

## Key Differences from the EIP-3009 Example

| Feature | EIP-3009 Example | Permit2 Example |
|---|---|---|
| Token support | USDC.e (EIP-3009 native) | Any ERC-20 token |
| Client signer | `privateKeyToAccount` | `toClientEvmSigner(account, publicClient)` |
| Gas sponsoring | Not needed (native auth) | ERC-20 approval + EIP-2612 |
| Server extensions | None | `declareErc20ApprovalGasSponsoringExtension()` |
