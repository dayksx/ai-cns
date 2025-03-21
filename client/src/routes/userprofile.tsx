import { useParams } from "react-router";
import { AccountInfo } from "../components/account-info";
import { FunctionComponent, useEffect, useState } from "react";
import { Hex } from "viem";
import { getNetizenBadgeAttestations } from "@/verax/attestations-reader";
import { getUserCredits } from "@/contracts/get-user-credits";
import { getUserInitiativeEvents } from "@/contracts/get-user-activities";

export const UserProfile: FunctionComponent = () => {
    const [badges, setBadges] = useState<string[]>([]);
    const [activities, setActivities] = useState<{ eventName: string }[]>([]);
    const [creditBalance, setCreditBalance] = useState<number>(0);
    const { netizenId } = useParams<{ netizenId: Hex }>();

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
                const activities = await getUserInitiativeEvents(netizenId);
                setActivities(activities);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
                setActivities([]);
            }
        };

        const fetchCreditBalance = async () => {
            if (!netizenId) return;
            try {
                const balance = await getUserCredits(netizenId);
                setCreditBalance(balance);
            } catch (error) {
                console.error("Failed to fetch credit balance:", error);
                setCreditBalance(0);
            }
        };

        fetchBadges();
        fetchActivities();
        fetchCreditBalance();
    }, [netizenId]);

    return (
        netizenId && (
            <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
                <AccountInfo
                    address={netizenId}
                    badges={badges}
                    activities={activities.map(
                        (activity) => activity.eventName
                    )}
                    creditBalance={creditBalance}
                />
            </div>
        )
    );
};
