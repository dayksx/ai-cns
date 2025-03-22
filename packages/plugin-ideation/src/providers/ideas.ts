import { elizaLogger, type IAgentRuntime, type Memory, type Provider, type State } from "@elizaos/core";
import { ethers } from "ethers";

const SMART_CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "bytes32", "name": "initiativeId", "type": "bytes32" },
            { "indexed": false, "internalType": "address", "name": "ideator", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "description", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" }
        ],
        "name": "InitiativeCreated",
        "type": "event"
    }
];
const CONTRACT_DEPLOYMENT_BLOCK = 10850877;
const BATCH_SIZE = 9999;
const MAX_INITIATIVES = 50;

const ideasProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        elizaLogger.info(`⏳ Provider: Fetch registered ideas to provide the information to the Agent`);

        try {
            // Validate environment variables
            const evmProviderUrl = process.env.EVM_PROVIDER_URL;
            const contractAddress = process.env.CNS_INITIATIVE_CONTRACT_ADDRESS;
            
            if (!evmProviderUrl || !contractAddress) {
                throw new Error("Missing required environment variables: EVM_PROVIDER_URL or CNS_INITIATIVE_CONTRACT_ADDRESS");
            }
            
            const iface = new ethers.Interface(SMART_CONTRACT_ABI);
            const provider = new ethers.JsonRpcProvider(evmProviderUrl);
            const latestBlock = await provider.getBlockNumber();
            
            let fromBlock = CONTRACT_DEPLOYMENT_BLOCK;
            let allInitiatives: any[] = [];

            while (fromBlock <= latestBlock) {
                const toBlock = Math.min(fromBlock + BATCH_SIZE, latestBlock);
                
                const logs = await provider.getLogs({
                    address: contractAddress,
                    topics: [iface.getEvent("InitiativeCreated").topicHash],
                    fromBlock,
                    toBlock
                });

                const initiatives = logs.map(log => {
                    const parsedLog = iface.parseLog(log);
                    return {
                        initiativeId: parsedLog.args.initiativeId,
                        ideator: parsedLog.args.ideator,
                        title: parsedLog.args.title,
                        description: parsedLog.args.description,
                        category: parsedLog.args.category,
                        score: parsedLog.args.score
                    };
                });
                
                allInitiatives = [...allInitiatives, ...initiatives];
                fromBlock = toBlock + 1;
            }

            // Limit the number of initiatives returned
            allInitiatives = allInitiatives.slice(-MAX_INITIATIVES);

            if (allInitiatives.length === 0) {
                return "No initiatives have been registered on-chain yet.";
            }

            const formattedInitiatives = allInitiatives.map((initiative, index) => `
                **Initiative #${index + 1}**
                - **Ideator:** ${initiative.ideator}
                - **Title:** ${initiative.title}
                - **Description:** ${initiative.description}
                - **Category:** ${initiative.category}
                - **Score:** ${initiative.score}
            `).join("\n");
            
            return `**The Consensys Network State (CNS) initiatives registered on-chain:**\n${formattedInitiatives}`;
        } catch (error) {
            elizaLogger.error(`❌ Error fetching initiatives: ${error.message}`, error);
            return "Failed to retrieve initiatives due to a technical issue.";
        }
    },
};

export { ideasProvider };
