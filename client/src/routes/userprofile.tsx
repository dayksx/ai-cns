/* eslint-disable */
// @ts-nocheck
import Jazzicon from "@metamask/jazzicon";
import { useParams } from "react-router";
import { FunctionComponent, useEffect, useState } from "react";
import { Hex, formatEther } from "viem";
import { getNetizenBadgeAttestations } from "@/verax/attestations-reader";
import { getUserCredits } from "@/contracts/get-user-credits";
import { getUserInitiativeEvents } from "@/contracts/get-user-activities";
import { getTokenBalance } from "@/lib/viem-utils";
import { PageHeader } from "@/components/page-header";
import { AccountInfo } from "@/components/account-info";

export const UserProfile: FunctionComponent = () => {
    const [badges, setBadges] = useState<
        { title: string; attestationId: string }[]
    >([]);
    const [activities, setActivities] = useState<string[]>([]);
    const [creditBalance, setCreditBalance] = useState<number>(0);
    const [cnsBalance, setCnsBalance] = useState<number>(0);
    const { netizenId } = useParams<{ netizenId: Hex }>();

    if (!netizenId) return <div>No data.</div>;
    const addr = netizenId.trim().slice(2, 10);
    const seed = parseInt(addr, 16);

    const jazziconElement = Jazzicon(10, seed);
    const gradientBackground = `linear-gradient(to right, #ff7e5f, #feb47b)`; // Static gradient instead of color extraction

    const shortenInitiativeId = (id: string) =>
        id.length > 10 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;

    const activityMessages = {
        CreditsUpdated: (args: { newCreditBalance: any }) =>
            `Credit balance updated to ${args.newCreditBalance}`,
        InitiativeCreated: (args: { title: any }) =>
            `Created initiative: "${args.title}"`,
        Downvoted: (args: { initiativeId: any; votesNumber: any }) =>
            `Downvoted initiative ${shortenInitiativeId(args.initiativeId)} (${
                args.votesNumber
            } votes)`,
        Upvoted: (args: { initiativeId: any; votesNumber: any }) =>
            `Upvoted initiative ${shortenInitiativeId(args.initiativeId)} (${
                args.votesNumber
            } votes)`,
        TeamMemberAdded: (args: { initiativeId: any }) =>
            `Joined initiative team ${shortenInitiativeId(args.initiativeId)}`,
        TeamMemberRemoved: (args: { initiativeId: any }) =>
            `Left initiative team ${shortenInitiativeId(args.initiativeId)}`,
        FundAllocated: (args: { initiativeId: any; amount: any }) =>
            `Allocated funds to initiative ${shortenInitiativeId(
                args.initiativeId
            )} (${formatEther(args.amount ?? 0n)?.substring(0, 5)} ETH)`,
        FundingWithdrawn: (args: { initiativeId: any; amount: any }) =>
            `Withdrew funds from initiative ${shortenInitiativeId(
                args.initiativeId
            )} (${formatEther(args.amount ?? 0n)?.substring(0, 5)} ETH)`,
    };

    useEffect(() => {
        if (!netizenId) return;

        const fetchBadges = async () => {
            try {
                const badgeData = await getNetizenBadgeAttestations(netizenId);
                setBadges(
                    badgeData?.map((badge) => ({
                        title: badge.scope,
                        attestationId: badge.attestationId,
                    })) || []
                );
            } catch (error) {
                console.error("Failed to fetch badges:", error);
                setBadges([]);
            }
        };

        const fetchActivities = async () => {
            try {
                const activityLogs = await getUserInitiativeEvents(netizenId);
                const formattedActivities = activityLogs.map((log: any) => {
                    const eventName =
                        log.eventName as keyof typeof activityMessages;
                    const formatMessage = activityMessages[eventName];

                    return formatMessage
                        ? formatMessage(log.args)
                        : `Unknown event: ${log.eventName}`;
                });
                setActivities(formattedActivities);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
                setActivities([]);
            }
        };

        const fetchBalances = async () => {
            try {
                const [credit, cns] = await Promise.all([
                    getUserCredits(netizenId),
                    getTokenBalance(
                        import.meta.env.VITE_CNS_TOKEN_ADDRESS,
                        netizenId
                    ),
                ]);
                setCreditBalance(credit);
                setCnsBalance(Number(cns) / 10 ** 18);
            } catch (error) {
                console.error("Failed to fetch balances:", error);
                setCreditBalance(0);
                setCnsBalance(0);
            }
        };

        fetchBadges();
        fetchActivities();
        fetchBalances();
    }, [netizenId]);

    return (
        <div
            className="relative flex flex-col w-full min-h-screen h-[100dvh] p-4"
            style={{ background: gradientBackground }}
        >
            {/* Semi-transparent dark overlay */}
            <div className="absolute inset-0 bg-gray-900/80"></div>

            {/* Main content */}
            <div className="relative flex-1 overflow-y-auto">
                <PageHeader title="" />
                <AccountInfo
                    address={netizenId}
                    badgesInfo={badges} // Corrected prop name
                    activities={activities}
                    creditBalance={creditBalance}
                    cnsBalance={cnsBalance}
                />
            </div>
        </div>
    );
};
