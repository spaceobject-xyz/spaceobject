import type { x402Facilitator } from "@x402/core/facilitator";
import type { Erc20ApprovalGasSponsoringSigner } from "@x402/extensions";
import { createErc20ApprovalGasSponsoringExtension } from "@x402/extensions";

import type { EvmChainId } from "../chains/evm";

export const createErc20ApprovalGasSponsoringRegistry = () => {
  const walletClients: Partial<
    Record<EvmChainId, Erc20ApprovalGasSponsoringSigner>
  > = {};

  return {
    registerSigner: (
      chainId: EvmChainId,
      signer: Erc20ApprovalGasSponsoringSigner
    ) => {
      walletClients[chainId] = signer;
    },
    getClient: (chainId: EvmChainId) => {
      return walletClients[chainId];
    },
  };
};
export type Erc20ApprovalGasSponsoringRegistry = ReturnType<
  typeof createErc20ApprovalGasSponsoringRegistry
>;

export const registerErc20ApprovalGasSponsoringExtension = (
  facilitator: x402Facilitator,
  registry: Erc20ApprovalGasSponsoringRegistry,
  defaultSigner?: Erc20ApprovalGasSponsoringSigner
) => {
  const resolvedDefaultSigner =
    defaultSigner ?? registry.getClient("eip155:16661");
  if (!resolvedDefaultSigner) return;

  facilitator.registerExtension(
    createErc20ApprovalGasSponsoringExtension(
      resolvedDefaultSigner,
      (network) => registry.getClient(network as EvmChainId)
    )
  );
};
