import { x402Client, x402HTTPClient } from "@x402/core/client";
import { toClientEvmSigner } from "@x402/evm";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zeroGMainnet } from "viem/chains";

// Create signer
const signer = privateKeyToAccount(
  process.env.ZEROG_PRIVATE_KEY as `0x${string}`
);

const publicClient = createPublicClient({
  chain: zeroGMainnet,
  transport: http(),
});

const evmSigner = toClientEvmSigner(signer, publicClient);

// Create x402 client and register EVM scheme
const client = new x402Client();
client.register("eip155:16661", new ExactEvmScheme(evmSigner));

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(fetch, client);

// Make request — payment is handled automatically
const response = await fetchWithPayment("http://localhost:3000/weather", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log("Response:", data);

// Get payment receipt from response headers
if (response.ok) {
  const httpClient = new x402HTTPClient(client);
  const paymentResponse = httpClient.getPaymentSettleResponse((name) =>
    response.headers.get(name)
  );
  console.log(
    "Transaction hash:",
    `https://chainscan.0g.ai/tx/${paymentResponse.transaction}`
  );
}
