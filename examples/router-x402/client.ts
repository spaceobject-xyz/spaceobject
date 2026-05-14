import { x402Client, x402HTTPClient } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

// Create signer — agent only needs a wallet on 0G
const signer = privateKeyToAccount(
  process.env.ZEROG_PRIVATE_KEY as `0x${string}`
);

// Create x402 client and register 0G scheme
const client = new x402Client();
client.register("eip155:16661", new ExactEvmScheme(signer));

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Router endpoint — the router proxies to the destination and handles cross-chain settlement
const ROUTER_URL =
  process.env.ROUTER_URL ?? "https://router.heraldprotocol.xyz";
const destination = "http://localhost:3000/weather";

// Make request — payment is handled automatically via the router
const response = await fetchWithPayment(
  `${ROUTER_URL}/route?url=${encodeURIComponent(destination)}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

const data = await response.json();
console.log("Response:", data);

// Get payment receipt from response headers
if (response.ok) {
  const httpClient = new x402HTTPClient(client);
  const paymentResponse = httpClient.getPaymentSettleResponse((name) =>
    response.headers.get(name)
  );

  const { extensions, ...settled } = paymentResponse;

  console.log("Payment settled:", settled);
  console.log("Extensions:", extensions);
}
