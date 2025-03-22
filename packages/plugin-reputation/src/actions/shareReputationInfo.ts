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

const reputationInfoTemplate = 
`# Ensuring Understanding of Consensys Network State (CNS) Reputation mechanism (attestations and tipping $CNS) 

Based on the conversation history, determine if the recipient lacks key context about how the CNS reputation mechanism works.  

## Previous Messages:  
{{recentMessages}}  

## Instructions:  
{{senderName}} has mentioned reputation, attestations or tipping $CNS. If **any essential information is missing**, provide a **concise** explanation, **avoiding redundancy**.  

**Only add missing details** from these key points:  
- AI and Human Agents can join CNS only if they have been attested by a Netizens
- Every day 100 $CNS credit are available for tipping Netizens according to their support, contribution, post etc.
- Netizens can issue Verax attestations constituting badges for the subject of those attestations, and a web of trust for the issuer, enabling to calculate reputation score

🚨 **Do NOT repeat information already in {{recentMessages}}.**  
✍️ Keep the response **sharp, clear, and no longer than 2-3 sentences.**  

You can also list attestations and $CNS balance of specific netizen to illustrate the explaination

Respond in {{agentName}}'s natural speaking style.`;


export const shareReputationInfoAction: Action = {
    name: "SHARE_REPUTATION_INFO",
    similes: ["SHARE_ATTESTATION_INFO", "SHARE_TIPPING_INFO", "SHARE_CNSTOKEN_INFO"],
    description:
        "Use this action only when user is asking about Consensys Network State (CNS) Reputation, Attestations or $CNS tipping to give more details",

    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info(`👀 Action validate: Sharing values`);

        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`🚀 Action handler: Share values`);
        
        try {
            // Setup state for context generation
            state = state ? await runtime.updateRecentMessageState(state) : (await runtime.composeState(message)) as State; state = await runtime.updateRecentMessageState(state);
            
            // Generate additional context information about the community values
            const reputationInfoContext = composeContext({ state, template: reputationInfoTemplate });
            const reputationInfo = await generateText({ runtime, context: reputationInfoContext, modelClass: ModelClass.SMALL });

            callback?.({ text: reputationInfo });

        } catch (error) {
            elizaLogger.error("Error fetching network state values:", error);
        }
        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "How does the CNS reputation system work?" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "In the Consensys Network State, reputation is built through attestations and tipping. Netizens can issue Verax attestations as badges of trust, and every day 100 $CNS credits are available for tipping contributors. Your reputation score is influenced by these factors.", 
                    action: "SHARE_REPUTATION_INFO" 
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "What is $CNS tipping?" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "$CNS tipping allows netizens to reward contributions daily. Each day, 100 $CNS credits are distributed, reinforcing the web of trust. Attestations also play a role in reputation-building.", 
                    action: "SHARE_REPUTATION_INFO" 
                },
            }
        ]
    ]  as ActionExample[][],
} as Action;
