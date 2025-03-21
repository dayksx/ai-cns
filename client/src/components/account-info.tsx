import {
    ConnectedNodes,
    ConnectedNodesProps,
} from "@/components/userprofile/connected-nodes";
import getConnectedNodes from "@/components/userprofile/random-nodes";
import { FunctionComponent, useMemo } from "react";
import { Hex } from "viem";
import { lineaSepolia } from "viem/chains";
import { useEnsName } from "wagmi";
// @ts-ignore
import Jazzicon from "@metamask/jazzicon";

export type AccountInfoProps = {
    address: Hex;
    badges: string[];
    activities: string[];
    creditBalance: number;
    cnsBalance: number;
};

export const AccountInfo: FunctionComponent<AccountInfoProps> = ({
    address,
    badges,
    activities,
    creditBalance,
    cnsBalance,
}) => {
    const { data: ensName, isLoading } = useEnsName({
        address,
        chainId: lineaSepolia.id,
    });

    const connectedNodes: ConnectedNodesProps = useMemo(
        () => getConnectedNodes(address),
        [address]
    );

    const getDisplayName = () => {
        if (isLoading) return "Loading...";
        return ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="flex flex-col h-screen text-white">
            {/* Top Section: Connected Nodes */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <ConnectedNodes data={connectedNodes} />
                <div className="absolute bottom-2 text-lg font-semibold">
                    {getDisplayName()}
                </div>
            </div>

            {/* Bottom Section: Badges, Activities & Balances */}
            <div className="p-6 flex shadow-md border-t border-gray-700">
                {/* Left Side: Badges & Activities */}
                <div className="w-2/3 pr-6">
                    {/* Badges Section */}
                    <div className="bg-gray-800 shadow-md p-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                            🎖️ Badges Earned
                        </h3>
                        {badges.length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-300">
                                {badges.map((badge, index) => (
                                    <li key={index}>{badge}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                No badges earned yet.
                            </p>
                        )}
                    </div>

                    {/* Activities Section */}
                    <div className="bg-gray-800 shadow-md p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                            📜 Recent Activities
                        </h3>
                        {activities.length > 0 ? (
                            <ul className="list-disc pl-5 text-gray-300">
                                {activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                No recent activities.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side: Balances */}
                <div className="w-1/3 flex flex-col space-y-4">
                    {/* CNS Balance Box */}
                    <div className="bg-gray-800 shadow-md p-4 flex flex-col items-center justify-center">
                        <h3 className="text-md font-semibold text-gray-300">
                            🌐 CNS Balance
                        </h3>
                        <p className="text-lg font-bold text-blue-400 mt-2">
                            {cnsBalance} CNS
                        </p>
                    </div>

                    {/* Credit Balance Box */}
                    <div className="bg-gray-800 shadow-md p-4 flex flex-col items-center justify-center">
                        <h3 className="text-md font-semibold text-gray-300">
                            💰 Credit Balance
                        </h3>
                        <p className="text-lg font-bold text-green-400 mt-2">
                            {creditBalance} Credits
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
