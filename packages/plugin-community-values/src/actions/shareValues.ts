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
    generateText
} from "@elizaos/core";
import { communityValuesURL, fetchCommunityValues } from "../providers";

const valuesInfoTemplate = 
`# Ensuring Understanding of Consensys Network State (CNS) Values  

Based on the conversation history, determine if the recipient lacks key context about how the CNS values mechanism works.  

## Previous Messages:  
{{recentMessages}}  

## Instructions:  
{{senderName}} has mentioned CNS values. If **any essential information is missing**, provide a **concise** explanation, **avoiding redundancy**.  

**Only add missing details** from these key points:  
- CNS values are determined dynamically by the community through ETH staking.  
- The community votes on values via this platform: https://ethereum-values.consensys.io/  
- Each value has an associated vault reflecting total shares, position count, and current share price.  

🚨 **Do NOT repeat information already in {{recentMessages}}.**  
✍️ Keep the response **sharp, clear, and no longer than 2-3 sentences.**  

Respond in {{agentName}}'s natural speaking style.`;


export const shareValuesAction: Action = {
    name: "SHARE_VALUES",
    similes: ["FETCH_VALUES", "SHOW_VALUES", "LIST_VALUES"],
    description:
        "Use this action only when user is asking about Consensys Network State (CNS) Values",

    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info(`Community Values sharing validation`);
        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`Community Values sharing handling`);
        
        try {
            // Setup state for context generation
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            
            // Generate additional context information about the community values
            const valuesInfoContext = composeContext({
                state,
                template: valuesInfoTemplate,
            });
            
            const communityValuesInfo = await generateText({
                runtime,
                context: valuesInfoContext,
                modelClass: ModelClass.SMALL,
            });

            if (callback) {
                callback({
                    text: communityValuesInfo,
                    content: {
                        url: {
                            communityValuesURL
                        },
                    },
                });
            }
        } catch (error) {
            elizaLogger.error("Error fetching network state values:", error);
        }

        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What are the values of the Consensys Network State?" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "The Consensys Network State values are Decentralization and Censorship resistance. These values are proposed dynamically by the community and their importance is weighted based on staked ETH. You can vote on values through this Dapp: https://ethereum-values.consensys.io/", 
                    action: "GET_NETWORK_VALUES" 
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Tell me about the CNS values" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "The Consensys Network State prioritizes Decentralization and Censorship resistance as core values. These aren't fixed - they're proposed and voted on by community members, with voting power determined by ETH stake. If you'd like to participate in shaping these values, check out https://ethereum-values.consensys.io/", 
                    action: "GET_NETWORK_VALUES" 
                },
            }
        ]
    ] as ActionExample[][],
} as Action;
