import type { Plugin } from "@elizaos/core";

import { issueAttestationAction } from "./actions/issueAttestation.ts"
import { attestationsProvider } from "./providers/attestations.ts"
import { tipCNSTokenAction } from "./actions/tipCNSToken.ts";
import { shareReputationInfoAction } from "./actions/shareReputationInfo.ts";

export const reputationPlugin: Plugin = {
    name: "reputation",
    description: "Issue points and attestations for netizens",
    actions: [issueAttestationAction, tipCNSTokenAction, shareReputationInfoAction],
    evaluators: [],
    providers: [attestationsProvider],
};
export default reputationPlugin;
