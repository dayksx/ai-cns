import { fetchAgreementSignedEvents } from "../viem-utils";

export interface Netizen {
    address: `0x${string}`;
    ens?: string;
    contribution: bigint;
    profileType: string;
    agentNature: string;
    constitutionHash: string;
    signedInBlock: bigint;
    timestamp: bigint | undefined;
}

export async function getCnsNetizens(): Promise<Netizen[]> {
    const eventLogs = await fetchAgreementSignedEvents(true);
    return eventLogs.map((event) => {
        return {
            address: event.args.user ?? "0x",
            contribution: event.args.etherAmount ?? 0n,
            profileType: event.args.userProfileType ?? "unknown",
            agentNature: event.args.userNatureAgent ?? "unkwown",
            constitutionHash:
                event.args.constitutionHash ??
                import.meta.env.VITE_CNS_CONSITUTION_HASH,
            signedInBlock: event.blockNumber ?? 0n,
            timestamp: event.args.timestamp ?? 0n,
        };
    });
}

export async function checkIsNetizen(address: `0x${string}`): Promise<boolean> {
    const netizens = await getCnsNetizens();
    return (
        netizens.find((netizen) => netizen.address === address) !== undefined
    );
}
