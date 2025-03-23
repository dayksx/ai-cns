import { createPublicClient, Hex, http, parseAbiItem } from "viem";
import { lineaSepolia } from "viem/chains";

const initiativeContractAddress = import.meta.env
    .VITE_CNS_INITIATIVE_CONTRACT_ADDRESS;

// Initialize the viem client
const client = createPublicClient({
    chain: lineaSepolia,
    transport: http(),
});

// Define event ABI items
const eventFilters = {
    TeamMemberAdded: parseAbiItem(
        "event TeamMemberAdded(bytes32 initiativeId, address member)"
    ),
    TeamMemberRemoved: parseAbiItem(
        "event TeamMemberRemoved(bytes32 initiativeId, address member)"
    ),
};

// Function to fetch team members for a specific initiative ID
export const getTeamMembersForInitiative = async (
    initiativeId: Hex
): Promise<Hex[]> => {
    try {
        // Fetch logs for the given initiativeId
        const addedLogs = await client.getLogs({
            address: initiativeContractAddress,
            event: eventFilters.TeamMemberAdded,
            args: { initiativeId },
            fromBlock: BigInt(0),
            toBlock: "latest",
        });

        const removedLogs = await client.getLogs({
            address: initiativeContractAddress,
            event: eventFilters.TeamMemberRemoved,
            args: { initiativeId },
            fromBlock: BigInt(0),
            toBlock: "latest",
        });

        const teamMembers = new Set<Hex>();

        // Process TeamMemberAdded events
        for (const log of addedLogs) {
            const { member } = log.args as { member: Hex };
            teamMembers.add(member);
        }

        // Process TeamMemberRemoved events
        for (const log of removedLogs) {
            const { member } = log.args as { member: Hex };
            teamMembers.delete(member);
        }

        return Array.from(teamMembers);
    } catch (error) {
        console.error("Error fetching team members for initiative:", error);
        return [];
    }
};
