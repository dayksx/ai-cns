import {
    composeContext,
    type Content,
    elizaLogger,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
    ActionExample,
    generateText,
} from "@elizaos/core";
import { ethers } from "ethers";

const isValidEVMAddress = (address: string) => {
    return ethers.isAddress(address);
};

type tipInformation = {
    recipient: string | null;
    sender: string | null;
    amount: string | null;
    reason: string | null;
};

const tippingContext = `# Extract $CNS Tipping Details
Respond with a JSON markdown block containing the relevant $CNS tipping details based on {{senderName}}'s request.

## **Recent Messages**
{{recentMessages}}

## **Example Response**
\`\`\`json
{
    "recipient": "0x224b11F0747c7688a10aCC15F785354aA6493ED6",
    "issuer": "0xd6EdD1484D45f8EF0f2eEB04db9DDDC401F09FC0",
    "amount": 100,
    "reason": "For supporting the team during the last social hack"
}
\`\`\`

## **Instructions**
{{senderName}} intends to send $CNS tokens to express gratitude or respect to a netizen.  
Your task is to extract the necessary details and return a JSON object for minting and transferring the $CNS ERC-20 tokens to the recipient.

### **Mandatory Fields to Extract**  
- **Recipient's EVM address** → Must be a valid \`0x[a-fA-F0-9]{40}\` address.  
- **Amount** → The exact amount of $CNS tokens to be sent.  

### **Optional Fields**  
- **Issuer's identity** → This need to be infer without asking, it can be an EVM address, username, petname, or client identifier.  
- **Reason** → If no explicit reason is mentioned, infer one from the tipping context.  

If conflicting details are present, **favor the most explicit and recent statements**.

### **Response Format**  
Return **only** the extracted data as a JSON markdown block.`;


const missingElementTemplate = `# Request for Missing Information for $CNS Tipping
Based on {{senderName}}'s recent messages, identify the missing details required to complete the $CNS token transfer.

## **Recent Messages**
{{recentMessages}}

## **Instructions**
{{senderName}} wants to tip a recipient with $CNS, but some required details are missing.  
Your task is to **ask for the missing information directly**, without acknowledgment or extra explanations.

### **Mandatory Missing Details**  
{{#if !recipient}}- **Recipient's EVM address** → Must be a valid \`0x[a-fA-F0-9]{40}\` address.{{/if}}  
{{#if !amount}}- **Amount of $CNS** → The exact number of tokens to be sent.{{/if}}  

### **Optional Missing Details**  
{{#if !reason}}- **Reason for the tip** → This is optional, but you can ask {{senderName}} for more context.{{/if}}  

## **Response Format**  
- Respond in **{{agentName}}'s** style and personality.  
- Please don't ask for information you already have in recent messages, ask only missing information in **a single message**.  
- Do **not** acknowledge the request—just ask for the required information.  
- Do **not** generate any output if all required fields are already provided.  
`;
const CNS_MINT_DAILY_CREDIT = 100;

const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintedToday",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const fetchMintedToday = async (provider: ethers.JsonRpcProvider): Promise<bigint> => {
    try {
        const contract = new ethers.Contract(process.env.CNS_TOKEN_ADDRESS, SMART_CONTRACT_ABI, provider);
        return await contract.mintedToday();
    } catch (error) {
        elizaLogger.error(`Failed to fetch mintedToday: ${error.message}`);
        throw new Error("Blockchain query failed");
    }
};

const executeMintTransaction = async (recipient: string, amount: string) => {
    const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
    const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CNS_TOKEN_ADDRESS, SMART_CONTRACT_ABI, signer);
    const parsedAmount = ethers.parseUnits(amount, 18);
    
    let attempt = 0;
    const MAX_RETRIES = 3;
    
    while (attempt < MAX_RETRIES) {
        try {
            const tx = await contract.mint(recipient, parsedAmount);
            elizaLogger.info(`Transaction sent: ${tx.hash}`);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                elizaLogger.info(`Transaction confirmed: ${tx.hash}`);
                return tx.hash;
            } else {
                throw new Error("Transaction failed: reverted on-chain");
            }
        } catch (error) {
            attempt++;
            elizaLogger.error(`Transaction attempt ${attempt} failed: ${error.message}`);
            if (attempt >= MAX_RETRIES) {
                throw new Error("All transaction attempts failed. Please try again later.");
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};

export const tipCNSTokenAction: Action = {
    name: "TIP",
    similes: [
        "SEND_TIP",
        "GIVE_TIP",
        "TRANSFER_TIP",
    ],
    description:
        "Only use this action when a user ask to send $CNS token to a specific EVM address",

    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info(`Tipping validation`);

        // placeholder: check if the given user is allowed to tip
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {

        elizaLogger.info("🚀 Handling $CNS token transfer");

        try {
            state = state ? await runtime.updateRecentMessageState(state) : (await runtime.composeState(message)) as State;

            // Extract tipping information
            const tipContext = composeContext({ state, template: tippingContext });
            const { recipient, amount, reason } = await generateObjectDeprecated({
                runtime,
                context: tipContext,
                modelClass: ModelClass.SMALL,
            });

            if (!isValidEVMAddress(recipient) || amount == 'null' || reason == 'null') {
                console.log('🚫 ==== Missing information for tipping ===', {recipient: recipient, isvalidEVMAddress: isValidEVMAddress(recipient), amount: amount, reason: reason});
                const missingInfoContext = composeContext({ state, template: missingElementTemplate });
                const missingDetails = await generateText({ runtime, context: missingInfoContext, modelClass: ModelClass.SMALL });
                callback?.({ text: missingDetails });
                return false;
            }

            console.log('🚀 ==== Minting and transfering $CNS token ===');
            const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL);
            const mintedToday = await fetchMintedToday(provider);
            console.log("là");
            const amountBN = ethers.parseUnits(amount.toString(), 18);
            const maxAmountBN = ethers.parseUnits(CNS_MINT_DAILY_CREDIT.toString(), 18)
            console.log("ici");
            console.log("$CNS mint: ", {mintedToday: mintedToday, amount: amount, amountBN: amountBN, maxAmountBN: maxAmountBN});

            if (mintedToday + amountBN > maxAmountBN) {
                callback?.({ text: "The daily credit for $CNS tipping has been reached." });
                return false;
            }

            try {
                const txHash = await executeMintTransaction(recipient, amount);
                callback?.({ text: `${recipient} received ${amount} $CNS tokens for "${reason}". Tx: https://sepolia.lineascan.build/tx/${txHash}` });
                return true;
            } catch (error) {
                callback?.({ text: `❌ Transaction failed: ${error.message}` });
                return false;
            }

        } catch (error) {
            elizaLogger.error(`Oops, something went wrong: ${error}`);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Hey {{agentName}}, please tip $ETH to @vitalik for creating Ethereum and bringing it there!" },
            },
            {
                user: "{{user1}}",
                content: { text: "A total of 10000 $ETH!" },
            },
            {
                user: "{{user1}}",
                content: { text: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" },
            },
            {
                user: "{{user2}}",
                content: { text: "Copy that! Let's do that", action: "TIP" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Tipping 50 $DAI to @jane for her great presentation!" },
            },
            {
                user: "{{user1}}",
                content: { text: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef" },
            },
            {
                user: "{{user2}}",
                content: { text: "Tip sent!", action: "TIP" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Please tip 200 to @bob for his help with the project!" },
            },
            {
                user: "{{user1}}",
                content: { text: "with $USDC!" },
            },
            {
                user: "{{user1}}",
                content: { text: "@bob address is 0x9876543210fedcba9876543210fedcba98765432" },
            },
            {
                user: "{{user2}}",
                content: { text: "Done @bob received your tip! ", action: "TIP" },
            }
        ]
    ] as ActionExample[][],
} as Action;