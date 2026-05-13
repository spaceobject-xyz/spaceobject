import type { AssetAmount, Price } from "@x402/core/types";
import type { Network } from "@x402/hono";
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

export class W0GEvmScheme extends ExactEvmScheme {
  private convertToTokenAmount(decimalAmount: string, decimals: number) {
    const amount = parseFloat(decimalAmount);
    if (Number.isNaN(amount)) {
      throw new Error(`Invalid amount: ${decimalAmount}`);
    }
    const [intPart, decPart = ""] = String(amount).split(".");
    const paddedDec = decPart.padEnd(decimals, "0").slice(0, decimals);
    const tokenAmount = (intPart + paddedDec).replace(/^0+/, "") || "0";
    return tokenAmount;
  }

  async parsePrice(price: Price, network: Network): Promise<AssetAmount> {
    if (network !== "eip155:16661") return super.parsePrice(price, network);

    if (typeof price === "number")
      return {
        asset: "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e",
        amount: this.convertToTokenAmount(price.toString(), 6),
        extra: {
          name: "Bridged USDC",
          version: "2",
        },
      };

    if (typeof price === "string") {
      const [decimalAmount] = price.split("W0G");

      const amount = this.convertToTokenAmount(decimalAmount.trim(), 18);

      return {
        asset: "0x1cd0690ff9a693f5ef2dd976660a8dafc81a109c",
        amount,
        extra: {
          assetTransferMethod: "permit2",
        },
      };
    }

    return price;
  }
}

app.use(
  paymentMiddleware(
    {
      "GET /weather": {
        accepts: [
          {
            scheme: "exact",
            price: "0.00033 W0G",
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
      new W0GEvmScheme()
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
