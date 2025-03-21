import { useParams } from "react-router";
import { AccountInfo } from "../components/account-info";
import { FunctionComponent, useEffect, useState } from "react";
import { Hex } from "viem";
import { getNetizenBadgeAttestations } from "@/verax/attestations-reader";
import { getUserCredits } from "@/contracts/get-user-credits";
import { getUserInitiativeEvents } from "@/contracts/get-user-activities";
import { getTokenBalance } from "@/lib/viem-utils";
import { PageHeader } from "@/components/page-header";

export const UserProfile: FunctionComponent = () => {
    const [badges, setBadges] = useState<string[]>([]);
    const [activities, setActivities] = useState<string[]>([]);
    const [creditBalance, setCreditBalance] = useState<number>(0);
    const [cnsBalance, setCnsBalance] = useState<number>(0); // State for CNS balance
    const { netizenId } = useParams<{ netizenId: Hex }>();

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
    };

    useEffect(() => {
        const fetchBadges = async () => {
            if (!netizenId) return;
            try {
                const badges = await getNetizenBadgeAttestations(netizenId);
                setBadges(badges?.map((badge) => badge.scope) || []);
            } catch (error) {
                console.error("Failed to fetch badges:", error);
                setBadges([]);
            }
        };

        const fetchActivities = async () => {
            if (!netizenId) return;
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
            if (!netizenId) return;
            try {
                const [credit, cns] = await Promise.all([
                    getUserCredits(netizenId),
                    getTokenBalance(
                        import.meta.env.VITE_CNS_TOKEN_ADDRESS,
                        netizenId
                    ), // Fetch CNS balance
                ]);
                setCreditBalance(credit);
                setCnsBalance(Number(cns));
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
        netizenId && (
            <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
                <div className="flex-1 overflow-y-auto">
                    <PageHeader title="" />
                    <AccountInfo
                        address={netizenId}
                        badges={badges}
                        activities={activities}
                        creditBalance={creditBalance}
                        cnsBalance={cnsBalance} // Pass CNS balance
                    />
                </div>
            </div>
        )
    );
};
