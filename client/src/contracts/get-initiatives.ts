import { createPublicClient, http, parseAbiItem } from "viem";
import { lineaSepolia } from "viem/chains";
import { contractAbi, contractAddress } from "./Initiative";

// Initialize the Viem public client
const publicClient = createPublicClient({
    chain: lineaSepolia, // Ensure it's the correct chain
    transport: http(),
});

// Function to fetch all initiatives directly from the contract
export async function getInitiatives() {
    try {
        // Get the total number of initiatives
        const events = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem(
                "event InitiativeCreated(bytes32 initiativeId, address ideator, string title, string description, string category)"
            ),
            fromBlock: BigInt(0),
            toBlock: "latest",
        });
        const totalInitiatives = events?.length;

        const initiatives: any[] = await Promise.all(
            Array.from({ length: Number(totalInitiatives) }, (_, index) =>
                publicClient.readContract({
                    address: contractAddress,
                    abi: contractAbi,
                    functionName: "initiatives",
                    args: [BigInt(index)], // Fetch each initiative by index
                })
            )
        );
        // Format initiatives
        return initiatives.map((initiative) => ({
            initiativeId: initiative[0], // bytes32 id
            ideator: initiative[1], // address
            instigator: initiative[2], // address
            title: initiative[3], // string title
            description: initiative[4], // string description
            category: initiative[5], // string category
            timestamp: Number(initiative[6]), // uint256 timestamp
            status: initiative[7], // string status
            upvotes: Number(initiative[8]), // uint256 upvotes
            downvotes: Number(initiative[9]), // uint256 downvotes
        }));
    } catch (error) {
        console.error("Error fetching initiatives:", error);
        return [];
    }
}
