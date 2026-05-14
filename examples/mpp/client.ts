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

async function main() {
  console.log("Requesting premium content...\n");

  const response = await mppx.fetch(`${BASE_URL}/weather`);
  const data = await response.json();

  console.log("Response:", data);
}

main().catch(console.error);
