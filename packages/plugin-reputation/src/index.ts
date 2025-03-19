import type { Plugin } from "@elizaos/core";

import { issueAttestationAction } from "./actions/issueAttestation.ts"
import { attestationsProvider } from "./providers/attestations.ts"

export const reputationPlugin: Plugin = {
    name: "reputation",
    description: "Issue points and attestations for netizens",
    actions: [issueAttestationAction],
    evaluators: [],
    providers: [attestationsProvider],
};
export default reputationPlugin;
