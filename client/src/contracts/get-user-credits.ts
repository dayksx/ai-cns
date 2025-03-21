import { InitiativeAbi } from "@/abi/Initiative.abi";
import { createPublicClient, http } from "viem";
import { lineaSepolia } from "viem/chains";

// Initialize the Viem public client
const publicClient = createPublicClient({
    chain: lineaSepolia, // Ensure it's the correct chain
    transport: http(),
});

// Function to fetch all initiatives directly from the contract
export async function getUserCredits(address: `0x${string}`) {
    try {
        const userCredits = await publicClient.readContract({
            address: import.meta.env.VITE_CNS_INITIATIVE_CONTRACT_ADDRESS,
            abi: InitiativeAbi,
            functionName: "userCredits",
            args: [address],
        });
        // Format initiatives
        return userCredits as number;
    } catch (error) {
        console.error("Error fetching userCredits:", error);
        return 0;
    }
}
