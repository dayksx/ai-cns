import { createPublicClient, http, parseAbiItem } from "viem";
import { lineaSepolia } from "viem/chains";

// Replace with your contract address
const CONTRACT_ADDRESS = "0xF6a04D1377A91e3b79e1A6B76C0aAB7152167EB6";

// Initialize the Viem public client
const publicClient = createPublicClient({
    chain: lineaSepolia, // Change to the correct chain (e.g., sepolia, polygon)
    transport: http(),
});

// Function to fetch `InitiativeCreated` events
export async function getInitiatives() {
    try {
        const events = await publicClient.getLogs({
            address: CONTRACT_ADDRESS,
            event: parseAbiItem(
                "event InitiativeCreated(bytes32 initiativeId, address instigator, string title, string description, string category)"
            ),
            fromBlock: BigInt(0), // Adjust based on deployment block for optimization
            toBlock: "latest",
        });

        // Format event data
        return events.map((event) => ({
            initiativeId: event.args.initiativeId,
            instigator: event.args.instigator,
            title: event.args.title,
            description: event.args.description,
            category: event.args.category,
        }));
    } catch (error) {
        console.error("Error fetching initiatives:", error);
        return [];
    }
}
