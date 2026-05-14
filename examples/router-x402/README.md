# Router x402 Example

Demonstrates how an agent holding funds on **0G** can pay a service that settles on **Base** via the [Herald Router](https://router.heraldprotocol.xyz).

- **Server**: A Hono app with a `/weather` endpoint that requires `$0.001` in **Base USDC** per request.
- **Client**: An agent with a wallet on **0G** that pays through the router — no Base wallet or gas tokens needed.

## Setup

```bash
bun install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `FACILITATOR_URL` | URL of the x402 facilitator (e.g. `https://facilitator.heraldprotocol.xyz`) |
| `BASE_RECIPIENT_ADDRESS` | EVM address that receives Base USDC payments |
| `ZEROG_PRIVATE_KEY` | Private key of the wallet holding USDC.e on 0G |
| `ROUTER_URL` | Herald Router URL (default: `https://router.heraldprotocol.xyz`) |

## Run

Start the server (sells weather data on Base):

```bash
bun run server.ts
```

In a separate terminal, run the client (pays from 0G via the router):

```bash
bun run client.ts
```

The client calls the router, which proxies to `/weather`, handles the 402 challenge, re-presents it mapped to 0G, and the client pays with USDC.e on 0G. The router then settles on Base and returns the weather response.

## How it works

1. Client sends request to `https://router.heraldprotocol.xyz/route/x402?url=http://localhost:3000/weather`.
2. Router proxies to the server and gets `402 Payment Required` (Base USDC).
3. Router re-presents the payment requirements mapped to 0G USDC.e.
4. Client signs a 0G payment and retries with `PAYMENT-SIGNATURE`.
5. Router settles the inbound payment on 0G, then pays the server on Base using its own wallet.
6. Router returns the server's response to the client.

## Key point

The server only knows about Base. The client only knows about 0G. The router bridges the two transparently.
