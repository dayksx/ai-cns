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
    CreditsUpdated: parseAbiItem(
        "event CreditsUpdated(address user, uint256 newCreditBalance)"
    ),
    InitiativeCreated: parseAbiItem(
        "event InitiativeCreated(bytes32 initiativeId, address ideator, string title, string description, string category, uint256 score)"
    ),
    Downvoted: parseAbiItem(
        "event Downvoted(bytes32 initiativeId, address voter, uint256 votesNumber)"
    ),
    Upvoted: parseAbiItem(
        "event Upvoted(bytes32 initiativeId, address voter, uint256 votesNumber)"
    ),
    TeamMemberAdded: parseAbiItem(
        "event TeamMemberAdded(bytes32 initiativeId, address member)"
    ),
    TeamMemberRemoved: parseAbiItem(
        "event TeamMemberRemoved(bytes32 initiativeId, address member)"
    ),
};

export const getUserInitiativeEvents = async (netizenAddress: Hex) => {
    try {
        const events = [];

        for (const [eventName, abiItem] of Object.entries(eventFilters)) {
            const logs = await client.getLogs({
                address: initiativeContractAddress,
                event: abiItem,
                fromBlock: BigInt(0),
                toBlock: "latest",
            });

            // Filter for events where the user is involved
            const filteredLogs = logs.filter((log) =>
                Object.values(log.args).includes(netizenAddress)
            );

            events.push(
                ...filteredLogs.map((log) => ({ eventName, ...log.args }))
            );
        }

        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};
