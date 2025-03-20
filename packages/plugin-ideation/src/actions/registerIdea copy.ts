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
    generateObjectDeprecated,
    generateText
} from "@elizaos/core";

import { ethers } from "ethers";

const isValidEVMAddress = (address: string) => {
    return ethers.isAddress(address);
};

type IdeaInformation = {
    instigator: string | null;
    title: string | null;
    description: string | null;
    tags?: string[];
    category?: string;
};
const ideaContext = `Respond with a JSON markdown block as described below containing the extracted values from the discussion with {{senderName}}. If there is missing information just let the value blank.

Example response:
\`\`\`json
{
    "instigator": "0x224b11F0747c7688a10aCC15F785354aA6493ED6",
    "title": "Title of the Idea",
    "description": "Detailed description of the idea",
    "tags": ["tag1", "tag2"],
    "category": "Category of the idea"
}
\`\`\`

# Instructions: {{senderName}} is proposing either a need, an idea, or an initiative related to the Consensys Network State (CNS) mission.
Your goal is to extract the most up-to-date data, from the recent Messages of the {{senderName}} based on their creation date (createdAt), related to the lattest mentioned ideas by the {{senderName}}.

- **Prioritize the most recent message from {{senderName}}**.  
- If critical details are missing, refer to the most relevant recent messages **but prioritize the latest information** based on "createdAt" information.  
- Do not include outdated details if more recent data contradicts them.  
- **Infer the most appropriate tags and category based on the context of the discussion.** If no explicit tags or category are mentioned, analyze the content and suggest the most relevant ones.

RecentMessagesData:
{{recentMessagesData}}

Extract the following details from {{senderName}}'s messages, prioritizing the most recent information:
- Instigator's EVM address (must be a valid 0x address)
- Idea title
- Idea description
- **Relevant tags (infer from context if not explicitly mentioned)**
- **Idea category (infer from context if not explicitly mentioned)**

Ensure that the JSON output reflects the **latest and most relevant submission** by {{senderName}}.

Respond with a JSON markdown block containing only the extracted values.`;

const missingIdeaInfoTemplate = `Based on the recent messages, the following information is missing to complete the idea registration:

{{recentMessages}}

Missing required details:
{{#if !instigator}}- Instigator's EVM address (must be a valid 0x address){{/if}}
{{#if !title}}- Idea title{{/if}}
{{#if !description}}- Idea description{{/if}}

To proceed, please provide the missing details. If you're still refining your idea, feel free to share more context or take the time to develop it further before submission.`;

const SMART_CONTRACT_ADDRESS = "0x5f903D7340fa36Cd3200216B56069e17902a4a1E";
const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType":"address","name":"_instigator","type":"address"},
            { "internalType": "string", "name": "_title", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "string", "name": "_category", "type": "string" },
            { "internalType": "string[]", "name": "_tags", "type": "string[]" }
        ],
        "name": "createInitiatives",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const registerIdeaAction: Action = {
    name: "REGISTER_IDEA",
    similes: ["SUBMIT_IDEA", "SHARE_IDEA", "STORE_IDEA"],
    description: "Use this action only when there is a mention of any need, idea, project, that could be carry within the consensys network state (CNS), in order to register it in the CNS initiatives registry smart contract for further vote",

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

            const ideaInformation: IdeaInformation = await generateObjectDeprecated({
                runtime,
                context: ideaContextData,
                modelClass: ModelClass.SMALL,
            });
            
            console.log('### Prompt for the agent: ', ideaContextData);
            console.log('I#dea information: ', ideaInformation);

            const { instigator, title, description, tags, category } = ideaInformation;

            if (!ideaInformation.instigator || !isValidEVMAddress(ideaInformation.instigator) || !ideaInformation.title || !ideaInformation.description) {

                if (!isValidEVMAddress(instigator)) console.log('### problem with the EVM address');

                const missingInfoContext = composeContext({
                    state,
                    template: missingIdeaInfoTemplate,
                });

                const missingInfoMessage = await generateText({
                    runtime,
                    context: missingInfoContext,
                    modelClass: ModelClass.SMALL,
                });

                console.log('Missing information request: ', missingInfoMessage);

                if (callback) {
                    callback({ text: missingInfoMessage });
                }
                return true;
            }
            
            // Connect to Ethereum network and smart contract
            const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
            const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
            const contract = new ethers.Contract(SMART_CONTRACT_ADDRESS, SMART_CONTRACT_ABI, signer);
            
            console.log("=== Registering initiative on-chain ===");
            
            const tx = await contract.createInitiatives(
                instigator,
                title,
                description,
                category || "",
                tags || []
            );
            
            await tx.wait();
            
            elizaLogger.info(`Idea successfully registered on-chain: https://sepolia.lineascan.build/tx/${tx.hash}`);

            if (callback) {
                callback({
                    text: `Your idea "${title}" has been successfully registered on-chain. Transaction Hash: https://sepolia.lineascan.build/tx/${tx.hash}`,
                    content: { transactionHash: tx.hash },
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
