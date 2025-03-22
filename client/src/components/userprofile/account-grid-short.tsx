import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { AccountCardShort } from "./account-card-short";
import { Netizen } from "@/lib/cns/get-cns-netizens";

export type AccountsGridShortProps = {
    netizens: Netizen[]; // Array of netizen account IDs
};

export const AccountsGridShort: FunctionComponent<AccountsGridShortProps> = ({
    netizens,
}) => {
    return (
        <div className="flex flex-col items-center">
            {/* Grid */}
            <div className="grid grid-cols-4 gap-4 p-4">
                {netizens.slice(0, 12).map((netizen) => (
                    <AccountCardShort
                        key={netizen.address}
                        address={netizen.address}
                        profileType={netizen.profileType}
                        agentNature={netizen.agentNature}
                    />
                ))}
            </div>

            {/* Show All Button */}
            <Link
                to="/allnetizens"
                className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
                Show All Netizens
            </Link>
        </div>
    );
};
