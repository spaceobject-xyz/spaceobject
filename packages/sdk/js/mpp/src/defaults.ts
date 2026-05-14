export const chainId = {
  mainnet: 16661,
  testnet: 16602,
} as const;

export type ChainId = (typeof chainId)[keyof typeof chainId];

const USDC_E = "0x1f3aa82227281ca364bfb3d253b0f1af1da6473e";

/** Chain ID → default currency. */
export const currency: Partial<Record<ChainId, string>> = {
  [chainId.mainnet]: USDC_E,
};

/** Default token decimals for USDC.e. */
export const decimals = 6;

/** Default RPC URLs per chain. */
export const rpcUrl: Record<number, string> = {
  [chainId.mainnet]: "https://evmrpc.0g.ai",
  [chainId.testnet]: "https://evmrpc-testnet.0g.ai",
};

/** ERC-3009 ABI (`transferWithAuthorization`, `receiveWithAuthorization`). */
export const erc3009Abi = [
  {
    type: "function",
    name: "transferWithAuthorization",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "receiveWithAuthorization",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

/**
 * Known tokens that support ERC-3009 (TransferWithAuthorization).
 * Keyed by lowercase address for case-insensitive lookup.
 */
export const erc3009Tokens: Record<string, { name: string; version: string }> =
  {
    [USDC_E.toLowerCase()]: {
      name: "Bridged USDC",
      version: "2",
    },
  };

/** Resolves the default currency for a given chain. */
export function resolveCurrency(parameters: {
  chainId?: number | undefined;
  testnet?: boolean | undefined;
}): string {
  const id =
    parameters.chainId ??
    (parameters.testnet ? chainId.testnet : chainId.mainnet);
  const resolved = currency[id as ChainId];
  if (!resolved)
    throw new Error(`No default currency configured for chainId ${id}.`);
  return resolved;
}
