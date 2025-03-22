import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { AccountCardShort } from "./account-card-short";
import { Netizen } from "@/lib/cns/get-cns-netizens";

export type AccountsGridShortProps = {
    netizens: Netizen[];
};

const profileStyles: Record<
    string,
    { text: string; boxBg: string; gradient: string }
> = {
    maker: {
        text: "text-gray-200",
        boxBg: "bg-gray-800",
        gradient:
            "bg-gradient-to-r from-gray-800/50 via-gray-800/10 to-transparent",
    },
    investor: {
        text: "text-teal-200",
        boxBg: "bg-teal-900",
        gradient:
            "bg-gradient-to-r from-teal-900/50 via-teal-900/10 to-transparent",
    },
    instigator: {
        text: "text-indigo-200",
        boxBg: "bg-indigo-900",
        gradient:
            "bg-gradient-to-r from-indigo-900/50 via-indigo-900/10 to-transparent",
    },
};

export const AccountsGridShort: FunctionComponent<AccountsGridShortProps> = ({
    netizens,
}) => {
    // Group netizens by profile type
    const groupedNetizens = netizens.reduce<Record<string, Netizen[]>>(
        (acc, netizen) => {
            if (!acc[netizen.profileType]) {
                acc[netizen.profileType] = [];
            }
            acc[netizen.profileType].push(netizen);
            return acc;
        },
        {}
    );

    return (
        <div className="flex flex-col w-full gap-6">
            {Object.entries(groupedNetizens).map(([profileType, accounts]) => {
                const styles =
                    profileStyles[profileType] || profileStyles.maker;

                return (
                    <div
                        key={profileType}
                        className={`flex items-center gap-6 p-5 rounded-lg shadow-md ${styles.gradient}`}
                    >
                        {/* Bigger Profile Type Box (More Height & Slightly More Width) */}
                        <div
                            className={`w-32 h-40 flex items-center justify-center text-lg font-semibold rounded-md ${styles.boxBg} ${styles.text}`}
                        >
                            {profileType.charAt(0).toUpperCase() +
                                profileType.slice(1)}
                        </div>

                        {/* Netizens Grid on the Right */}
                        <div className="grid grid-cols-4 gap-4 flex-1">
                            {accounts.slice(0, 4).map((netizen) => (
                                <AccountCardShort
                                    key={netizen.address}
                                    address={netizen.address}
                                    profileType={netizen.profileType}
                                    agentNature={netizen.agentNature}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
            <Link
                to="/allnetizens"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-600 transition-shadow w-fit shadow-md hover:shadow-lg"
            >
                Show All Netizens
            </Link>
        </div>
    );
};
