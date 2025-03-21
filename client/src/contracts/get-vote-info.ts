import { createPublicClient, http, parseAbiItem } from "viem";
import { lineaSepolia } from "viem/chains";

const publicClient = createPublicClient({
    chain: lineaSepolia,
    transport: http(),
});

export async function getVoteInfo(
    initiativeId: string, // Must be a valid bytes32 string
    address: `0x${string}` | undefined
): Promise<{ votesNumber: number; upvote?: boolean }> {
    if (!address) return { votesNumber: 0, upvote: undefined };

    console.log(
        "Fetching credits for initiative:",
        initiativeId,
        "voter:",
        address
    );

    try {
        // Fetch Upvoted logs
        const upvoteLogs = await publicClient.getLogs({
            address: import.meta.env.VITE_CNS_INITIATIVE_CONTRACT_ADDRESS,
            event: parseAbiItem(
                "event Upvoted(bytes32 initiativeId, address voter, uint256 votesNumber)"
            ),
            args: { initiativeId, voter: address },
            fromBlock: "earliest",
        });

        if (upvoteLogs.length > 0) {
            return {
                votesNumber: Number(upvoteLogs[0].args.votesNumber),
                upvote: true,
            };
        }

        // Fetch Downvoted logs
        const downvoteLogs = await publicClient.getLogs({
            address: import.meta.env.VITE_CNS_INITIATIVE_CONTRACT_ADDRESS,
            event: parseAbiItem(
                "event Downvoted(bytes32 initiativeId, address voter, uint256 votesNumber)"
            ),
            args: { initiativeId, voter: address },
            fromBlock: "earliest",
        });

        if (downvoteLogs.length > 0) {
            return {
                votesNumber: Number(downvoteLogs[0].args.votesNumber),
                upvote: false,
            };
        }

        return { votesNumber: 0, upvote: undefined };
    } catch (error) {
        console.error("Error fetching past events:", error);
        return { votesNumber: 0, upvote: undefined };
    }
}
