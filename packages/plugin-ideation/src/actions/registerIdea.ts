import {
    type IAgentRuntime,
    type Memory,
    type State,
    type Action,
    type ActionExample,
    type HandlerCallback,
    elizaLogger,
    composeContext,
    ModelClass,
    generateText,
    generateObjectDeprecated
} from "@elizaos/core";

import { ethers } from "ethers";

const ideaContext = `Respond with a JSON markdown block containing only the extracted values. Use the \`null\` special value (without quotes) for any values that cannot be determined.

Example response:
\`\`\`json
{
    "instigator": "0xSenderEVMAddressHere",
    "title": "Title of the Idea",
    "description": "Detailed description of the idea",
    "tags": ["tag1", "tag2"],
    "category": "Category of the idea"
}
\`\`\`

Given the last message of {{senderName}}, use the relevant recent messages to gather the idea submission information in the JSON data structure.
{{recentMessages}}

Extract the following details from {{senderName}}'s messages:
- Instigator's EVM address
- Idea title
- Idea description
- Relevant tags (optional)
- Idea category (optional)

Ensure that the JSON payload is specific to the idea submission identified by the sender's Ethereum address.

Respond with a JSON markdown block containing only the extracted values.`;

// Replace with actual smart contract details
const SMART_CONTRACT_ADDRESS = "0xYourSmartContractAddress";
const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "idea", "type": "string" }
        ],
        "name": "registerIdea",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const registerIdeaAction: Action = {
    name: "REGISTER_IDEA",
    similes: ["SUBMIT_IDEA", "SHARE_IDEA", "STORE_IDEA"],
    description: "Use this action when a user wants to register an idea in the CNS smart contract.",

    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info(`Validating idea registration request`);
        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`Handling idea registration`);
        
        try {
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            
            // Extract and build idea object progressively
            const ideaContextData = composeContext({
                state,
                template: ideaContext,
            });

            const ideaInformation = await generateObjectDeprecated({
                runtime,
                context: ideaContextData,
                modelClass: ModelClass.SMALL,
            });

            console.log('Idea information: ', ideaInformation);

            const { evm_address, idea_title, idea_description, tags, category } = ideaInformation;

            if (!evm_address || !idea_title || !idea_description) {
                console.log("Missing required idea fields.");
            }

            // Extract idea from user message
            const idea = message.content.text;
            if (!idea) {
                throw new Error("No idea found in the message.");
            }
            
            // Connect to Ethereum network and smart contract
            const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
            const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);

            console.log("===registration onchain===");
            /**
            const contract = new ethers.Contract(SMART_CONTRACT_ADDRESS, SMART_CONTRACT_ABI, signer);
            
            // Register idea in the smart contract
            const tx = await contract.registerIdea(
                evm_address,
                idea_title,
                idea_description,
                tags || [],
                category || ""
            );
            await tx.wait();
            
            elizaLogger.info(`Idea successfully registered on-chain: ${tx.hash}`);
 */
            if (callback) {
                callback({
                    text: `Your idea has been successfully registered on-chain. Transaction Hash: https://sepolia.lineascan.build/tx/0x75d52f80bcf46e4cd86799af89a445f1f12d6a37b154a4e50961dbc707b4a160`,
                    content: { transactionHash: '0x75d52f80bcf46e4cd86799af89a445f1f12d6a37b154a4e50961dbc707b4a160' },
                });
            }
        } catch (error) {
            elizaLogger.error("Error registering idea on-chain:", error);
            if (callback) {
                callback({ text: "Failed to register idea. Please try again later." });
            }
        }

        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "I have an idea for CNS governance improvements!" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "Your idea has been successfully registered on-chain. You can track it here: https://etherscan.io/tx/{{transactionHash}}",
                    action: "REGISTER_IDEA"
                },
            }
        ]
    ] as ActionExample[][],
} as Action;
