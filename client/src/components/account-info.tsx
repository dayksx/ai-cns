import {
    ConnectedNodes,
    ConnectedNodesProps,
} from "@/components/userprofile/connected-nodes";
import getConnectedNodes from "@/components/userprofile/random-nodes";
import { FunctionComponent, useMemo } from "react";
import { Hex } from "viem";
// @ts-ignore
import Jazzicon from "@metamask/jazzicon";
import { Address } from "./cns/address";

export type BadgeInfo = {
    title: string;
    attestationId: string;
};

export type AccountInfoProps = {
    address: Hex;
    badgesInfo: BadgeInfo[];
    activities: string[];
    creditBalance: number;
    cnsBalance: number;
};

export const AccountInfo: FunctionComponent<AccountInfoProps> = ({
    address,
    badgesInfo,
    activities,
    creditBalance,
    cnsBalance,
}) => {
    const connectedNodes: ConnectedNodesProps = useMemo(
        () => getConnectedNodes(address),
        [address]
    );

    return (
        <div className="flex flex-col h-screen text-white">
            {/* Top Section: Connected Nodes */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 pb-4">
                <ConnectedNodes data={connectedNodes} />
                <div className="text-lg font-semibold">
                    <Address
                        address={address}
                        showFullAddress={false}
                    ></Address>
                </div>
            </div>

            {/* Bottom Section: Badges, Activities & Balances */}
            <div className="p-6 flex shadow-md border-t border-gray-700">
                {/* Left Side: Badges & Activities */}
                <div className="w-2/3 pr-6">
                    {/* Badges Section */}
                    <div className="bg-gray-800 shadow-md p-4 mb-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                            🎖️ Badges Earned
                        </h3>
                        {badgesInfo.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {badgesInfo.map((badge, index) => {
                                    // Define random colors for each badge
                                    const colors = [
                                        "bg-blue-500",
                                        "bg-green-500",
                                        "bg-yellow-500",
                                        "bg-purple-500",
                                        "bg-pink-500",
                                        "bg-red-500",
                                    ];
                                    const randomColor =
                                        colors[index % colors.length]; // Rotate colors

                                    return (
                                        <button
                                            key={badge.attestationId}
                                            onClick={() =>
                                                window.open(
                                                    `https://explorer.ver.ax/linea-sepolia/attestations/${badge.attestationId}`,
                                                    "_blank"
                                                )
                                            }
                                            className={`px-3 py-1 text-sm font-semibold text-white ${randomColor} bg-opacity-70 rounded-md transition hover:bg-opacity-100`}
                                        >
                                            {badge.title}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No badges earned yet.
                            </p>
                        )}
                    </div>

                    {/* Activities Section */}
                    <div className="bg-gray-800 shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">
                            📜 Recent Activities
                        </h3>
                        {activities.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {activities.map((activity, index) => {
                                    // Define some border colors to differentiate activities
                                    const colors = [
                                        "border-blue-500",
                                        "border-green-500",
                                        "border-yellow-500",
                                        "border-purple-500",
                                    ];
                                    const borderColor =
                                        colors[index % colors.length];

                                    return (
                                        <div
                                            key={index}
                                            className={`p-3 bg-gray-700 text-gray-200 rounded-md shadow-sm border-l-4 ${borderColor}`}
                                        >
                                            {activity}
                                        </div>
                                    );
                                })}
                            </div>
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
