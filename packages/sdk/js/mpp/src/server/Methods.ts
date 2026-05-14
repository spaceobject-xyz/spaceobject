import type { Method } from "mppx";

import { charge as charge_ } from "./Charge.js";

/**
 * Creates a 0G `charge` server method.
 *
 * @example
 * ```ts
 * import { Mppx } from "mppx/server";
 * import { zerog } from "@heraldprotocol/mpp/server";
 *
 * const mppx = Mppx.create({
 *   methods: [zerog({ recipient: "0x...", currency: "0x..." })],
 * });
 * ```
 */
export function zerog(
  parameters?: zerog.Parameters
): readonly [Method.AnyServer] {
  return [zerog.charge(parameters)] as const;
}

export namespace zerog {
  export type Parameters = charge_.Parameters;

  /** Creates a 0G `charge` method for one-time ERC-20 token transfers. */
  export const charge = charge_;
}
