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

const isAnIdeaContext = `Respond with a boolean, wether or not the last message of {{senderName}} is sharing a new idea, or need or initiative.
{{message}}

Example response:
\`\`\`json
false
\`\`\`

# Instructions:  
{{senderName}} is sending a {{message}}, identify if this message is a new idea, need or initiative that is relevant to register or not

Return only a boolean true or false`;

const ideaContext = `Respond with a JSON markdown block containing the relevant details of the last idea proposed by {{senderName}}, based on {{senderName}} last messages:
{{recentMessages}}

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

# Instructions:  
{{senderName}} is sharing a need, an idea, or an initiative for Consensys Network State (CNS). Your task is to extract relevant details in order to return a JSON object that will be used for the on-chain registration of this community idea.

Extract the following from {{senderName}}'s latest messages, prioritizing the most recent and relevant details:
- Instigator's EVM address (valid 0x address)
- Idea title
- Idea description
- Tags (optional)
- Category (optional)

If recent messages provide conflicting details, always favor the latest information.  
If no explicit tags or category are mentioned, infer the most appropriate tags and category based on the context of the discussion.

Return only the extracted data as a JSON markdown block.`;


const missingIdeaInfoTemplate = `Based on the recent messages, the following information is missing to complete the idea registration:

{{recentMessages}}

Missing required details:
{{#if !instigator}}- Instigator's EVM address (must be a valid 0x address){{/if}}
{{#if !title}}- Idea title{{/if}}
{{#if !description}}- Idea description{{/if}}

To proceed, please provide the missing details. If you're still refining your idea, feel free to share more context or take the time to develop it further before submission.`;

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
    description: "Only use this action when a new idea, need or initiative for Consensys Network State (CNS) is mentioned",

    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        elizaLogger.info(`👀 Action validate: Validating idea registration request`);
   
        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`🚀 Action handler: Idea registration`);

        try {
            
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            
            // Extracting idea information in a JSON data structure
            console.log("🛠 Extracting idea information");
            const ideaContextData = composeContext({
                state,
                template: ideaContext,
            });

            const ideaInformation: IdeaInformation = await generateObjectDeprecated({
                runtime,
                context: ideaContextData,
                modelClass: ModelClass.SMALL,
            });

            console.log('🔧 Idea information: ', ideaInformation);

            let { instigator, title, description, tags, category } = ideaInformation;

            // Treatment in case of missing information
            if (!instigator || !isValidEVMAddress(instigator) || !title || !description) {

                const missingInfoContext = composeContext({
                    state,
                    template: missingIdeaInfoTemplate,
                });
                const missingInfoMessage = await generateText({
                    runtime,
                    context: missingInfoContext,
                    modelClass: ModelClass.SMALL,
                });

                if (callback) {
                    callback({ text: missingInfoMessage });
                }
                return false;

            // Treatment in case of valid information
            } else {
                const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
                const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
                const contract = new ethers.Contract(process.env.CNS_INITIATIVE_CONTRACT_ADDRESS, SMART_CONTRACT_ABI, signer);
                
                console.log("🔧=== Registering initiative on-chain ===");
                
                const tx = await contract.createInitiatives(instigator, title, description, category || "", tags || []);
                await tx.wait();
                
                elizaLogger.info(`Idea successfully registered on-chain: ${tx.hash}`);
    
                if (callback) {
                    callback({
                        text: `Your idea "${title}" has been successfully registered on-chain. Transaction Hash: https://sepolia.lineascan.build/tx/${tx.hash}`,
                        content: { transactionHash: tx.hash },
                    });
                }
                console.log("🔧 return true")
                return true;
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
                content: {
                    text: "I have an idea for a decentralized app that connects local farmers directly with consumers, cutting out middlemen and reducing food waste.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "That's a fantastic idea! I've registered your concept for a decentralized farm-to-consumer marketplace onchain via Linea Sepolia. The transaction is confirmed and you can view it on the block explorer. Your idea is now permanently recorded on the blockchain!",
                    action: "REGISTER_ONCHAIN_IDEA",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "What if we created a smart contract system that automatically releases funds to disaster relief organizations based on verified weather data?",
                },
            },
            {
                user: "{{user3}}",
                content: {
                    text: "That could really speed up response times!",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Can you register this idea onchain?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Parametric Disaster Relief Fund' idea onchain through our Linea Sepolia smart contract. The transaction is complete and your concept is now immutably recorded with proper attribution. You can check the transaction details on Linea Sepolia's block explorer.",
                    action: "REGISTER_ONCHAIN_IDEA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "We should build a tool that converts plain English to smart contract code, making blockchain development accessible to non-programmers.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've captured your idea for a 'Natural Language Smart Contract Generator' and registered it onchain via Linea Sepolia. This innovative concept for democratizing blockchain development is now permanently recorded with your attribution. The transaction is confirmed and available on the block explorer.",
                    action: "REGISTER_ONCHAIN_IDEA",
                },
            },
        ],
        [
            {
                user: "{{user3}}",
                content: {
                    text: "What if we created a DAO that focuses on funding ocean cleanup initiatives, with governance tokens that can only be earned through verified cleanup activities?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "That's brilliant! It aligns incentives perfectly.",
                },
            },
            {
                user: "{{user3}}",
                content: {
                    text: "Can you register this concept on the blockchain?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Ocean Cleanup DAO' concept onchain through our Linea Sepolia smart contract. Your innovative governance model is now immutably recorded on the blockchain. You can view the transaction details on Linea Sepolia's block explorer. Your idea is preserved with proper attribution.",
                    action: "REGISTER_ONCHAIN_IDEA",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "I need to register my idea for a cross-chain identity solution that allows users to maintain a consistent identity across multiple blockchains without revealing personal information.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Cross-Chain Anonymous Identity' concept onchain via Linea Sepolia. This solution addresses the important challenge of maintaining consistent user identity across multiple blockchains while preserving privacy. The transaction is confirmed and your idea is now permanently recorded with your attribution.",
                    action: "REGISTER_ONCHAIN_IDEA",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
