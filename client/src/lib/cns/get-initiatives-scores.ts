import { fetchScoreUpdatedEvents } from "../viem-utils";

export async function getInitiativesScores(): Promise<
    { initiativeId: `0x${string}`; newScore: bigint }[]
> {
    const eventLogs = await fetchScoreUpdatedEvents(true);
    return eventLogs.map((event) => {
        return {
            initiativeId: event.args.initiativeId ?? "0x",
            newScore: event.args.newScore ?? 0n,
        };
    });
}
