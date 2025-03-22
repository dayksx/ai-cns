import { FunctionComponent } from "react";
import { AccountCardShort } from "./account-card-short";
import { Netizen } from "@/lib/cns/get-cns-netizens";

export type AccountsGridShortProps = {
    netizens: Netizen[]; // Array of netizen account IDs
};

export const AccountsGridShort: FunctionComponent<AccountsGridShortProps> = ({
    netizens,
}) => {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {netizens.slice(0, 9).map((netizen) => (
                <AccountCardShort
                    key={netizen.address}
                    address={netizen.address}
                    profileType={netizen.profileType}
                    agentNature={netizen.agentNature}
                />
            ))}
        </div>
    );
};
