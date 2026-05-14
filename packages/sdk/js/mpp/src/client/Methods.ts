import type { Method } from "mppx";

import { charge as charge_ } from "./Charge.js";

/**
 * Creates a 0G `charge` client method.
 *
 * @example
 * ```ts
 * import { Mppx } from "mppx/client";
 * import { zerog } from "@heraldprotocol/mpp/client";
 *
 * const mppx = Mppx.create({
 *   methods: [zerog({ account })],
 * });
 * ```
 */
export function zerog(
  parameters: zerog.Parameters = {}
): readonly [Method.AnyClient] {
  return [charge_(parameters)] as const;
}

export namespace zerog {
  export type Parameters = charge_.Parameters;

  /** Creates a 0G `charge` client method for one-time ERC-20 token transfers. */
  export const charge = charge_;
}
