import { Hono } from "hono";
import { logger } from "hono/logger";
import { Mppx } from "mppx/hono";
import { privateKeyToAccount } from "viem/accounts";

import { zerog } from "@heraldprotocol/mpp/server";

const account = privateKeyToAccount(
  process.env.SERVER_PRIVATE_KEY as `0x${string}`
);

const mppx = Mppx.create({
  methods: [
    zerog({
      recipient: account.address,
      account,
    }),
  ],
});

const app = new Hono();

app.use(logger());

app.get("/", (c) => c.text("0G MPP Example Server"));

app.get("/weather", mppx.charge!({ amount: "0.001" }), (c) =>
  c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  })
);

export default app;
