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
    ideator: string | null;
    title: string | null;
    description: string | null;
    tags?: string[];
    category?: string;
};

interface IdeaScoring {
    title: string | null;
    valueAlignment: string | null;
    innovation: string | null;
    needRelevance: string | null;
    feasibility: string | null;
    sustainability: string | null;
    scalability: string | null;
    governanceCoordination: string | null;
    globalRating: string | null;
    rationale: string | null;
}

const ideaContext = `# Extract CNS Idea Registration Details
Respond with a JSON markdown block containing the relevant details of the last idea proposed by {{senderName}}.
You need to make a clear difference between different mentioned ideas, if it's a new idea you should re-extract and infer the information.

## **Recent Messages**
{{recentMessages}}

## **Example Response**
\`\`\`json
{
    "ideator": "0x224b11F0747c7688a10aCC15F785354aA6493ED6",
    "title": "Title of the Idea",
    "description": "Detailed description of the idea",
    "tags": ["tag1", "tag2"],
    "category": "Category of the idea",
    "exist": false,
    "finalized": false
}
\`\`\`

## **Instructions**
{{senderName}} is proposing a **need, idea, or initiative** for the Consensys Network State (CNS).  
Your task is to extract the relevant details and return a **structured JSON object** for on-chain registration.

### **Mandatory Fields to Extract**  
- **ideator's EVM address** → Must be a valid \`0x[a-fA-F0-9]{40}\` address.  
- **Idea Title** → A concise yet meaningful title.  
- **Idea Description** → A detailed explanation of the idea.  

### **Optional Fields**  
- **Tags** → Keywords or themes associated with the idea.  
- **Category** → A broader classification of the idea.  

### **Finalization**
- The **finalized** field should be set to **false** by default.
- The agent should ask the user if they want to register the idea on-chain or if they need more refinement or prefer to keep it off-chain.
- Set **finalized** to **true** only if the user explicitly mentions that the idea is ready to be registered on-chain.

If conflicting details are present, **favor the most recent and explicit information**.  
If no **tags or category** are provided, infer them from the context of the discussion.

### **Response Format**  
Return **only** the extracted data as a JSON markdown block.`;

const missingIdeaInfoTemplate = `# Request for Missing Information for CNS Idea Registration
Based on {{senderName}}'s recent messages, some details are missing to complete the idea registration.

## **Recent Messages**
{{recentMessages}}

## **Missing Required Details**  
Request only the missing information, or the information that cannot be inferred with the {{agentName}} personality and style. 

{{#if !ideator}}- **Ideator's EVM address** → Must be a valid \`0x[a-fA-F0-9]{40}\` address owned by {{senderName}}.{{/if}}  
{{#if !description}}- **Idea Description** → Request {{senderName}} to provide additional context to fully clarify the vision behind the idea.  
If not already done, according to recent messages, specify to {{senderName}} that this idea has the potential to shape the collective future of CNS. To maximize its impact, ask to ensure a clear description of the idea. If the idea is still in development, suggest refining it further. In the meantime, {{agentName}} can provide insights and feedback on how it could better align with the values of the Consensys Network State (CNS) if needed.{{/if}}  

## **Next Steps**  
To proceed, request the missing details.  
If necessary, provide guidance on how the idea could better align with the values of the **Consensys Network State (CNS)**.  
If the idea requires further refinement, inform {{senderName}} that they can take additional time to develop it before submission, ensuring a stronger and more impactful proposal.`

const valueAlignmentScoring = `## **Idea Evaluation & Scoring**

Evaluate the idea proposed by **{{senderName}}** based on its alignment with the **core values and strategic priorities** of the Consensys Network State (CNS). Assign **individual ratings (1-100) per criterion**, and compute an **overall score**.

## **Recent Messages**
{{recentMessages}}

## **Evaluation Criteria**
Assess the idea based on the following **key dimensions**:

1. **Value Alignment** – How well does the idea align with CNS principles like decentralization, privacy, open-source ethos, and censorship resistance?
2. **Innovation** – Does the idea introduce novel approaches, technologies, or perspectives?
3. **Need & Relevance** – Does the idea address a real problem or opportunity within the CNS ecosystem?
4. **Feasibility** – How realistic is the implementation in terms of resources, technology, and adoption?
5. **Sustainability & Long-Term Viability** – Can the idea sustain itself economically and environmentally over time?
6. **Scalability** – Is the idea designed to function effectively as adoption grows?
7. **Governance & Coordination** – Does the idea enhance on-chain or off-chain governance, collaboration, or decision-making?

## **Response Format**
Return a **JSON markdown block** containing:
- The **title** of the idea.
- A **score (1-100) per criterion**.
- A **global rating** (average of all scores) This should never be a float, just integers value.
- A **concise rationale** explaining the evaluation.

\`\`\`json
{
    "title": "{{ideaTitle}}",
    "valueAlignment": 90,
    "innovation": 75,
    "needRelevance": 85,
    "feasibility": 70,
    "sustainability": 80,
    "scalability": 65,
    "governanceCoordination": 88
    "globalRating": 79,
    "rationale": "The idea aligns strongly with CNS values and governance but has scalability concerns. Feasibility is moderate due to technical complexity."
}
\`\`\`

## **Instructions**
- **Provide a score (1-100) for each criterion** based on how well the idea meets it.
- **Calculate the global rating** as the average of all scores.
- **Justify** the evaluation with a brief rationale covering strong and weak points.
- **Do not** return a response if the idea lacks sufficient detail for evaluation.
- **If unclear**, infer a reasonable estimate but highlight any uncertainties. `;

const ideaImprovementTemplate = `# Provide Feedback on Idea Improvements and Linea Building Blocks

Based on the idea proposed by {{senderName}}, provide constructive feedback on how to better align with CNS values and suggest relevant Linea building blocks.

## **Recent Messages**
{{recentMessages}}

## **Idea Details**
- Title: {{ideaTitle}}
- Description: {{ideaDescription}}
- Current Score: {{globalRating}}

## **Instructions**
1. First, summarize the idea in your own words to ensure you've understood it correctly. Ask {{senderName}} to confirm if your understanding is accurate.

2. Only if the understanding is confirmed, provide focused feedback in the following format:

   **Value Alignment Improvements**
   - Only identify specific areas where the idea could better align with CNS values if there are clear opportunities
   - Suggest concrete improvements only for identified areas
   - If the idea already aligns well with CNS values, acknowledge this instead of forcing improvements

   **Linea Building Block Recommendations**
   - List only relevant Linea building blocks that could directly enhance this specific idea
   - Explain how each building block could specifically benefit this idea
   - Include specific use cases and integration points
   - If no building blocks are particularly relevant, state this clearly

   **Implementation Suggestions**
   - Provide high-level technical recommendations only if they add value
   - Suggest potential partnerships or collaborations only if they make sense for this idea
   - Outline key milestones only if they help clarify the implementation path

3. Keep the feedback focused and relevant to this specific idea. If there are no significant improvements to suggest, acknowledge the idea's strengths instead of providing generic feedback.

## **Response Format**
Return a structured response that:
- Starts with a clear summary of the idea
- Is constructive and actionable
- Focuses on specific improvements rather than general feedback
- Provides clear next steps for implementation
- Maintains {{agentName}}'s natural speaking style

## **Next Steps**
After providing the feedback, ask {{senderName}} if they feel their idea is ready to be registered on-chain, or if they'd like to refine it further based on the suggestions provided.`;

const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_ideator", "type": "address" },
            { "internalType": "string", "name": "_title", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "string", "name": "_category", "type": "string" },
            { "internalType": "string[]", "name": "_tags", "type": "string[]" },
            { "internalType": "uint256", "name": "_score", "type": "uint256" }
        ],
        "name": "createInitiatives",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const registerIdeaAction: Action = {
    name: "REGISTER_IDEA",
    similes: ["REGISTER_NEED", "REGISTER_INITIATIVE", "REGISTER_PROJECT", "SUBMIT_IDEA", "SHARE_IDEA", "STORE_IDEA"],
    description: "Only use this action when a new idea, need or initiative for CNS is mentioned",

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
            state = state ? await runtime.updateRecentMessageState(state) : (await runtime.composeState(message)) as State;

            // Extracting idea information
            console.log("🛠 Extracting idea information");
            const ideaContextData = composeContext({ state, template: ideaContext });
            let { ideator, title, description, tags, category, finalized } = await generateObjectDeprecated({ runtime, context: ideaContextData, modelClass: ModelClass.SMALL });

            // Convert finalized string to boolean
            finalized = finalized === "true" || finalized === true;

            // Missing idea information
            console.log("ideator check", {ideator:ideator, isvalidEVMAddress: isValidEVMAddress(ideator), title: title, description: description});
            if (!isValidEVMAddress(ideator) || !title || !description) {
                console.log('🚫 ==== Missing information for idea registration ===', {isvalidEVMAddress: isValidEVMAddress(ideator), title: title, description: description});
                const missingInfoContext = composeContext({ state, template: missingIdeaInfoTemplate });
                const missingInfoMessage = await generateText({ runtime, context: missingInfoContext, modelClass: ModelClass.SMALL});
                callback?.({ text: missingInfoMessage });
                return false;
            }
            console.log('🔧 Idea information: ', { ideator, title, description, tags, category, finalized });
            
            // Scoring idea
            console.log("🛠 Scoring idea information");
            const ideaScoringData = composeContext({ state, template: valueAlignmentScoring });
            const ideaScoring = await generateObjectDeprecated({ runtime, context: ideaScoringData, modelClass: ModelClass.SMALL });
            console.log('🔧 Idea scoring: ', ideaScoring);
            let { globalRating } = ideaScoring;
            
            // Registration confirmation
            if (!finalized) {
                // Provide feedback on improvements and Linea building blocks
                console.log("🛠 Generating improvement feedback");
                const improvementContext = composeContext({ 
                    state, 
                    template: ideaImprovementTemplate,
                    templatingEngine: "handlebars"
                });
                const improvementFeedback = await generateText({ 
                    runtime, 
                    context: improvementContext, 
                    modelClass: ModelClass.SMALL 
                });
                callback?.({ text: improvementFeedback });
                return false;
            }

            // Idea registration
            console.log('🚀 ==== Registering idea onchain ===');
            const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
            const contactAddress = process.env.CNS_INITIATIVE_CONTRACT_ADDRESS;
            elizaLogger.info("🔗 Initative Smart Contract address: ", contactAddress);
            if (await provider.getCode(contactAddress) === "0x") {
                console.error("❌ No contract deployed at this address!");
                return false;
            }
            const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
            const contract = new ethers.Contract(contactAddress, SMART_CONTRACT_ABI, signer);
            
            console.log("contract.createInitiatives(", {ideator, title, description, category , tags, globalRating});
            const tx = await contract.createInitiatives(ethers.getAddress(ideator), title, description, category || "", tags || [], globalRating);
            await tx.wait();
            elizaLogger.info(`✅ Idea successfully registered on-chain: ${tx.hash}`);
            callback?.({ text: `Your idea "${title}" has been successfully registered on-chain. Transaction Hash: https://sepolia.lineascan.build/tx/${tx.hash}` });
            
            return true;
            
        } catch (error) {
            elizaLogger.error("Error registering idea on-chain:", error);
            if (callback) {
                callback({ text: "Failed to register idea. Please try again later." });
            }
        }
        return false;
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
                    text: "Thank you for sharing your idea about a decentralized farm-to-consumer marketplace! I've taken note of it. This concept has strong potential to reduce food waste and create more equitable economics for farmers.\n\nBased on my analysis, your idea scores well on value alignment (85/100) and need relevance (90/100), as it promotes decentralization and addresses real market inefficiencies. The innovation score is moderate (75/100) as similar concepts exist but your approach seems unique. Feasibility is good (80/100) assuming standard blockchain infrastructure.\n\nTo strengthen this concept, you might consider:\n- Adding a reputation system for quality assurance\n- Incorporating a token model that incentivizes sustainable farming practices\n- Exploring integration with Linea's payment solutions for lower transaction fees\n\nWould you like me to register this idea on-chain, or would you prefer to refine it further based on this feedback?",
                    action: "REGISTER_IDEA",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Yes, please register it on-chain.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Your idea for a 'Decentralized Farm-to-Consumer Marketplace' has been successfully registered on-chain via Linea Sepolia. The transaction is confirmed and your concept is now permanently recorded with your attribution. You can view the transaction details at https://sepolia.lineascan.build/tx/0x123456789abcdef.",
                    action: "REGISTER_IDEA",
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
                user: "{{agent}}",
                content: {
                    text: "I've noted your idea for a parametric disaster relief fund using smart contracts and weather oracles. This is a compelling concept that could significantly improve humanitarian aid efficiency.\n\nLooking at the evaluation metrics:\n- Value Alignment: 92/100 (strongly supports public goods and transparency)\n- Innovation: 85/100 (combines existing technologies in a novel application)\n- Feasibility: 78/100 (requires reliable oracle integration and disaster response partnerships)\n- Sustainability: 88/100 (could attract ongoing support from both donors and aid organizations)\n\nTo enhance this concept, you might consider:\n- Incorporating multiple data sources beyond weather (news APIs, local reports)\n- Adding governance mechanisms for fund allocation decisions\n- Exploring Linea's oracle solutions for reliable data feeds\n\nWould you like to register this idea on-chain now, or would you prefer to develop it further?",
                    action: "REGISTER_IDEA",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Yes, please register it on-chain. I think the core concept is solid.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Parametric Disaster Relief Fund' idea on-chain through our Linea Sepolia smart contract. The transaction is complete and your concept is now immutably recorded with proper attribution. You can check the transaction details on Linea Sepolia's block explorer at https://sepolia.lineascan.build/tx/0x123456789abcdef.",
                    action: "REGISTER_IDEA",
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
                    text: "I've captured your idea for a 'Natural Language Smart Contract Generator'. This is an excellent concept that could significantly lower barriers to entry in blockchain development.\n\nHere's my evaluation:\n- Value Alignment: 95/100 (strongly promotes accessibility and decentralization)\n- Innovation: 88/100 (pushes boundaries of current developer tools)\n- Feasibility: 70/100 (challenging NLP problem, but achievable with current AI capabilities)\n- Scalability: 85/100 (could serve a growing audience of non-technical creators)\n\nSome considerations to strengthen this idea:\n- Starting with limited scope (specific contract types) before expanding\n- Incorporating educational components to help users understand the generated code\n- Adding verification tools to ensure security of generated contracts\n\nWould you like me to register this idea on-chain now, or would you prefer to refine the concept further?",
                    action: "REGISTER_IDEA",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Let's register it now. I can work on the refinements as I develop it.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Your 'Natural Language Smart Contract Generator' idea has been successfully registered on-chain via Linea Sepolia. This innovative concept for democratizing blockchain development is now permanently recorded with your attribution. The transaction is confirmed and available on the block explorer at https://sepolia.lineascan.build/tx/0xabcdef123456789.",
                    action: "REGISTER_IDEA",
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
                user: "{{agent}}",
                content: {
                    text: "I've noted your idea for an 'Ocean Cleanup DAO' with activity-based governance tokens. This is a fascinating concept that combines environmental impact with innovative governance.\n\nMy evaluation shows strong potential:\n- Value Alignment: 96/100 (combines public goods, sustainability, and decentralization)\n- Innovation: 90/100 (novel approach to DAO participation and governance)\n- Need Relevance: 92/100 (addresses critical environmental challenges)\n- Governance: 94/100 (creates direct alignment between contribution and decision-making)\n\nSome considerations to strengthen the implementation:\n- Developing verification mechanisms for cleanup activities (perhaps using geolocation and photos)\n- Creating partnerships with existing ocean cleanup organizations\n- Exploring Linea's low-cost transactions to make micro-contributions viable\n\nWould you like me to register this concept on-chain, or would you prefer to develop these aspects further?",
                    action: "REGISTER_IDEA",
                },
            },
            {
                user: "{{user3}}",
                content: {
                    text: "Yes, please register this concept on the blockchain.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Ocean Cleanup DAO' concept on-chain through our Linea Sepolia smart contract. Your innovative governance model is now immutably recorded on the blockchain. You can view the transaction details at https://sepolia.lineascan.build/tx/0xfedcba987654321. Your idea is preserved with proper attribution and received an overall score of 92/100.",
                    action: "REGISTER_IDEA",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "I need to share my idea for a cross-chain identity solution that allows users to maintain a consistent identity across multiple blockchains without revealing personal information.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Thank you for sharing your 'Cross-Chain Anonymous Identity' concept. I've noted the details of your idea, which addresses an important challenge in the blockchain ecosystem.\n\nMy evaluation indicates this is a strong concept:\n- Value Alignment: 94/100 (strongly supports privacy and interoperability)\n- Innovation: 88/100 (tackles an unsolved problem in the space)\n- Feasibility: 75/100 (technically challenging but achievable)\n- Scalability: 90/100 (becomes more valuable as blockchain adoption grows)\n\nTo strengthen this concept, you might consider:\n- Exploring zero-knowledge proof implementations for privacy preservation\n- Defining governance mechanisms for identity verification standards\n- Investigating Linea's cross-chain communication capabilities as potential infrastructure\n\nWould you like me to register this idea on-chain now, or would you prefer to develop these aspects further?",
                    action: "REGISTER_IDEA",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'd like to register it now, please.",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I've registered your 'Cross-Chain Anonymous Identity' concept on-chain via Linea Sepolia. This solution addresses the important challenge of maintaining consistent user identity across multiple blockchains while preserving privacy. The transaction is confirmed and your idea is now permanently recorded with your attribution. You can view the details at https://sepolia.lineascan.build/tx/0x1a2b3c4d5e6f7890.",
                    action: "REGISTER_IDEA",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
