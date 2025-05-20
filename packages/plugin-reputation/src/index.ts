import type { Plugin } from "@elizaos/core";

import { issueAttestationAction } from "./actions/issueAttestation.ts"
import { attestationsProvider } from "./providers/attestations.ts"
import { cnsBalanceProvider } from "./providers/cnsBalance.ts"
import { topHoldersProvider } from "./providers/topHolders.ts"
import { tipCNSTokenAction } from "./actions/tipCNSToken.ts";

export const reputationPlugin: Plugin = {
    name: "reputation",
    description: "Issue points and attestations for netizens",
    actions: [issueAttestationAction, tipCNSTokenAction],
    evaluators: [],
    providers: [attestationsProvider, cnsBalanceProvider, topHoldersProvider],
};
export default reputationPlugin;
