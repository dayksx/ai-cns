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
    "category": "Category of the idea"
    "exist": false
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
            let { ideator, title, description, tags, category } = await generateObjectDeprecated({ runtime, context: ideaContextData, modelClass: ModelClass.SMALL });

            // Missing idea information
            console.log("ideator check", {ideator:ideator, isvalidEVMAddress: isValidEVMAddress(ideator), title: title, description: description});
            if (!isValidEVMAddress(ideator) || !title || !description) {
                console.log('🚫 ==== Missing information for idea registration ===', {isvalidEVMAddress: isValidEVMAddress(ideator), title: title, description: description});
                const missingInfoContext = composeContext({ state, template: missingIdeaInfoTemplate });
                const missingInfoMessage = await generateText({ runtime, context: missingInfoContext, modelClass: ModelClass.SMALL});
                callback?.({ text: missingInfoMessage });
                return false;
            }
            console.log('🔧 Idea information: ', { ideator, title, description, tags, category });
            
            // Scoring idea
            console.log("🛠 Scoring idea information");
            const ideaScoringData = composeContext({ state, template: valueAlignmentScoring });
            const ideaScoring = await generateObjectDeprecated({ runtime, context: ideaScoringData, modelClass: ModelClass.SMALL });
            console.log('🔧 Idea scoring: ', ideaScoring);
            let { globalRating } = ideaScoring;
            
            // Idea registration
            console.log('🚀 ==== Registering idea onchain ===');
            const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
            if (await provider.getCode(process.env.CNS_INITIATIVE_CONTRACT_ADDRESS) === "0x") {
                console.error("❌ No contract deployed at this address!");
                return false;
            }
            const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
            const contract = new ethers.Contract(process.env.CNS_INITIATIVE_CONTRACT_ADDRESS, SMART_CONTRACT_ABI, signer);
            
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
