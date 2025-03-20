import {
    type IAgentRuntime,
    type Memory,
    type State,
    type Action,
    type HandlerCallback,
    elizaLogger,
    composeContext,
    ModelClass,
    generateObjectDeprecated,
    generateText,
    ActionExample,
    generateTrueOrFalse
} from "@elizaos/core";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { ethers } from "ethers";

const isValidEVMAddress = (address: string) => {
    return ethers.isAddress(address);
};

type AttestationInformation = {
    subject: string | null;
    scope: string | null;
    isTrustworthy: string | null;
};



const attestationContext = `Respond with a JSON markdown block containing the relevant trust attestation details for {{subjectName}}, based on the issuer's assessment:
{{issuerAssessment}}

Example response:
\`\`\`json
{
    "subject": "0x224b11F0747c7688a10aCC15F785354aA6493ED6",
    "scope": "Build",
    "isTrustworthy": true,
}
\`\`\`

# Instructions:  
The issuer is sharing their trust assessment of {{subjectName}}. Your task is to extract relevant details in order to return a JSON object that will be used for the on-chain registration of this trust attestation.

Extract the following from the issuer's assessment, ensuring all required fields are present:
- Subject's EVM address (valid 0x address)
- Scope (the domain or area in which the trust assessment applies)
- isTrustworthy (boolean: true for trust, false for distrust)

If the assessment provides conflicting details, always favor the most explicit statements.
If no explicit reasons are mentioned, infer the most appropriate reasons based on the context of the assessment.

Return only the extracted data as a JSON markdown block.`;

const missingAttestationInfoTemplate = `Based on the recent messages, the following information is missing to complete the attestation:

{{recentMessages}}

Missing required details:
{{#if !subject}}- Subject's EVM address (must be a valid 0x address){{/if}}

To proceed, please provide the missing details.`;

// Default portal address for Verax
const DEFAULT_PORTAL_ADDRESS = "0xeea25bc2ec56cae601df33b8fc676673285e12cc";


export const issueAttestationAction: Action = {

    name: "ISSUE_ATTESTATION",
    similes: ["CREATE_ATTESTATION", "VERIFY_ATTESTATION", "ATTEST"],
    description: "Only use this action when a user expresses the will to issue an attestation toward a specifc subject identified by and EVM address",

    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        elizaLogger.info(`👀 Action validate: Issue attestation`);
        
        // Check if the message is about issuing an attestation

        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`🚀 Action handler: Issue attestation`);
        try {
            // Get recent messages for context
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            // Extracting idea information in a JSON data structure
            console.log("🛠 Extracting idea information");
            const attestationContextData = composeContext({
                state,
                template: attestationContext,
            });

            const attestationInformation: AttestationInformation = await generateObjectDeprecated({
                runtime,
                context: attestationContextData,
                modelClass: ModelClass.SMALL,
            });

            console.log('🔧 Attestation information: ', attestationInformation);

            let { subject, scope, isTrustworthy } = attestationInformation;
            if (!subject || !isValidEVMAddress(subject) || !scope) {
                if (callback) {
                    callback({
                        text: `I miss some information to issue attestation`,
                        content: { error: true },
                    });
                }
                return false;
            }
            
            if (!process.env.EVM_PUBLIC_KEY && !process.env.EVM_PRIVATE_KEY) {
                elizaLogger.log("missing EVM_PUBLIC_KEY and EVM_PRIVATE_KEY");
                return false
            }

            const veraxSdk = new VeraxSdk(
                VeraxSdk.DEFAULT_LINEA_SEPOLIA,
                undefined, // Replace with your public address
                process.env.EVM_PRIVATE_KEY as `0x${string}`    // Replace with your private key
            );

            const portalAddress = "0x4787Fd2DfE83C0e5d07d2BA1aEF12Afc5c4fe306";
            const schemaId = "0x8660da4093987072670aba14868d8dc4112ea88a777f7434a54ea8e7925a1a73";

            console.log("veraxSDL object: ", veraxSdk)
            
            if (subject && veraxSdk) {
                try {
                    console.log("🔧=== Registering attestation on-chain ===");
                    let expirationDate = 0;
                    let receipt = await veraxSdk.portal.attest(
                        portalAddress,
                        {
                            schemaId,
                            expirationDate,
                            subject: subject,
                            attestationData: [{
                                scope: scope,
                                isTrustworthy: (isTrustworthy=='true')?true:false,
                            }],
                        },
                        [],
                        false
                    );
                    if (receipt.transactionHash) {
                        elizaLogger.info(`Attestation successfully registered on-chain: ${receipt.transactionHash}`);
    
                        if (callback) {
                            callback({
                                text: `Your attestation, claiming that you ${isTrustworthy?"trust":"distrust"} ${subject} for "${scope}" has been successfully registered on-chain. Transaction Hash: https://sepolia.lineascan.build/tx/${receipt.transactionHash}, explorer: https://explorer.ver.ax/linea-sepolia/portals/0x4787fd2dfe83c0e5d07d2ba1aef12afc5c4fe306`,
                                content: { transactionHash: receipt.transactionHash },
                            });
                        }
                    } else {
                        if (callback) {
                            callback({
                                text: `Something went wrong, please try later`,
                                content: { error: true },
                            });
                        }
                    }
                } catch (e) {
                    console.log(e);
                    if (e instanceof Error) {
                        alert(`Oops, something went wrong: ${e.message}`);
                    }
                }
            }
            
            return true;
        } catch (error) {
            elizaLogger.error("Error issuing Verax attestation:", error);
            
            
            return false;
        }
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you issue a Verax attestation that I'm a buidler?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've issued a Verax attestation confirming your buidler status. The attestation is now permanently recorded on the blockchain and can be verified through the Verax protocol. The transaction is confirmed and available on the block explorer.",
                    action: "ISSUE_ATTESTATION",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "I need to verify that 0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47 is a member of our DAO using Verax.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've issued a Verax attestation confirming that 0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47 is a verified member of your DAO. The attestation has been recorded on-chain through the Verax protocol and can be verified by anyone. The transaction is complete and can be viewed on the block explorer.",
                    action: "ISSUE_ATTESTATION",
                },
            },
        ],
        [
            {
                user: "{{user3}}",
                content: {
                    text: "I want to issue an attestation that 0x224b11F0747c7688a10aCC15F785354aA6493ED6 completed our web3 developer course.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've issued a Verax attestation confirming that 0x224b11F0747c7688a10aCC15F785354aA6493ED6 has successfully completed your web3 developer course. This credential is now permanently recorded on the blockchain via the Verax protocol and can be verified by potential employers or other interested parties. The transaction is confirmed and available on the block explorer.",
                    action: "ISSUE_ATTESTATION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I need to attest that my address 0x9bA590dd7FBd5bd1a7D06CdCB4744e20A49B3520 owns the ENS domain 'blockchain-developer.eth'.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've issued a Verax attestation confirming that 0x9bA590dd7FBd5bd1a7D06CdCB4744e20A49B3520 is the owner of the ENS domain 'blockchain-developer.eth'. This ownership attestation is now recorded on-chain via the Verax protocol and can be verified by anyone. The transaction is complete and can be viewed on the block explorer.",
                    action: "ISSUE_ATTESTATION",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "Can you create an attestation using the Verax protocol that I've contributed to the Ethereum ecosystem?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've issued a Verax attestation confirming your contributions to the Ethereum ecosystem. This recognition is now permanently recorded on the blockchain through the Verax protocol and can be verified by anyone. The transaction is complete and the attestation is available on the block explorer.",
                    action: "ISSUE_ATTESTATION",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;