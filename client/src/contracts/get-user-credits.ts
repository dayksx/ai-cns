import { createPublicClient, http } from "viem";
import { lineaSepolia } from "viem/chains";
import { contractAbi, contractAddress } from "./Initiative";

// Initialize the Viem public client
const publicClient = createPublicClient({
    chain: lineaSepolia, // Ensure it's the correct chain
    transport: http(),
});

// Function to fetch all initiatives directly from the contract
export async function getUserCredits(address: `0x${string}`) {
    try {
        const userCredits = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: "userCredits",
            args: [address],
        });
        // Format initiatives
        return userCredits;
    } catch (error) {
        console.error("Error fetching userCredits:", error);
        return 0;
    }
}
