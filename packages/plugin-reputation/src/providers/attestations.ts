import {
    elizaLogger,
    type IAgentRuntime,
    type Memory,
    type Provider,
    type State,
} from "@elizaos/core";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

// Default portal address for Verax
const PORTAL_ADDRESS = process.env.CNS_VERAX_PORTAL_ID as `0x${string}`;

const attestationsProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        elizaLogger.info(`⏳ Provider: Fetch peer trust attestations`);
        try {
            const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
            const attestationDataMapper = veraxSdk.attestation; // RW Attestations
            const schemaId = process.env.CNS_VERAX_SCHEMA_ID as `0x${string}`;

            elizaLogger.info("🔗 Verax Portal address: ", PORTAL_ADDRESS);
            const myAttestations = await attestationDataMapper.findBy(
                20, // first - can be set to limit the number of results, null means no limit
                null, // skip - can be set to paginate results, null means start from the beginning
                {
                    portal: PORTAL_ADDRESS.toLowerCase(),
                    schema: schemaId, // Add this if you want to filter by schema
                },
                "id", // orderBy - using "id" which is likely to be valid
                "desc" // orderDirection - most recent first
            );

            const formattedAttestations = myAttestations
                .map((attestation, index) => {
                    const [scope, isTrustworthy] = attestation.decodedData;
                    return `
                    **Attestation issued to ${attestation.subject}:**
                    - **Scope:** ${scope}
                    - **Trustworthiness:** ${
                        isTrustworthy ? "Trusted" : "Not Trusted"
                        }
                    - **URL:** https://explorer.ver.ax/linea-sepolia/attestations/${
                            attestation.id
                        }
                    `;
                })
                .join("\n");
                
            return `**Lattest attestations issued by Netizens reflecting the trustworthiness of human and AI Agents on a certain scope: **\n${formattedAttestations}`;
        } catch (error) {}
    },
};

export { attestationsProvider };
