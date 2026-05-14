import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import {
  declareEip2612GasSponsoringExtension,
  declareErc20ApprovalGasSponsoringExtension,
} from "@x402/extensions";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
const evmAddress = process.env.ZEROG_RECIPIENT_ADDRESS!;
const facilitatorUrl =
  process.env.FACILITATOR_URL ?? "https://facilitator.heraldprotocol.xyz";

const facilitatorClient = new HTTPFacilitatorClient({
  url: facilitatorUrl,
});

app.use(logger());

function convertToTokenAmount(decimalAmount: string, decimals: number) {
  const amount = parseFloat(decimalAmount);
  if (Number.isNaN(amount)) {
    throw new Error(`Invalid amount: ${decimalAmount}`);
  }
  const [intPart, decPart = ""] = String(amount).split(".");
  const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
  const tokenAmount = (intPart + paddedDec).replace(/^0+/, "") || "0";
  return tokenAmount;
}

app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: [
          {
            scheme: "exact",
            price: {
              asset: "0x1cd0690ff9a693f5ef2dd976660a8dafc81a109c",
              amount: convertToTokenAmount("0.0005", 18),
              extra: {
                assetTransferMethod: "permit2",
              },
            },
            network: "eip155:16661",
            payTo: evmAddress,
          },
        ],
        description: "Weather data",
        mimeType: "application/json",
        extensions: {
          ...declareEip2612GasSponsoringExtension(),
          ...declareErc20ApprovalGasSponsoringExtension(),
        },
      },
    },
    new x402ResourceServer(facilitatorClient).register(
      "eip155:16661",
      new ExactEvmScheme()
    )
  )
);

app.get("/weather", (c) => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

app.onError(async (err, c) => {
  return c.json({ error: err.message }, 500);
});

export default app;
