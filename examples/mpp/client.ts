import { Mppx } from "mppx/client";
import { privateKeyToAccount } from "viem/accounts";

import { zerog } from "@heraldprotocol/mpp/client";

const account = privateKeyToAccount(
  process.env.CLIENT_PRIVATE_KEY as `0x${string}`
);

const mode = "pull";

const mppx = Mppx.create({
  methods: [zerog({ account, mode })],
});

const BASE_URL = process.env.SERVER_URL ?? "http://localhost:3000";

type PaymentReceipt = {
  method: "zerog";
  status: "success" | "failed";
  timestamp: string;
  reference: string;
};

async function main() {
  const response = await mppx.fetch(`${BASE_URL}/weather`);
  const data = await response.json();

  console.log("Response:", data);

  const responseHeaders = response.headers.get("payment-receipt");
  if (!responseHeaders) return console.log("No payment receipt found");
  const paymentReceipt = JSON.parse(
    atob(responseHeaders as string)
  ) as PaymentReceipt;
  console.log(
    "Transaction hash:",
    `https://chainscan.0g.ai/tx/${paymentReceipt.reference}`
  );
}

main().catch(console.error);
