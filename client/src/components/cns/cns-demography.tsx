import { Netizen } from "../../lib/cns/get-cns-netizens";
import { AccountsGridShort } from "../userprofile/account-grid-short";
import { NetizensChart } from "./netizens-chart";

export function CnsDemography({ netizens }: { netizens: Netizen[] }) {
    return (
        <>
            <div className="flex flex-col items-start gap-2">
                <span className="text-3xl font-bold text-blue-400 uppercase">
                    Demography
                </span>
                <div className="flex flex-row items-end gap-2">
                    <span className="text-6xl font-bold text-blue-500">
                        {netizens?.length}
                    </span>
                    <span className="text-2xl font-bold text-blue-200">
                        Netizens
                    </span>
                </div>
            </div>
            <div>
                <NetizensChart netizens={netizens} />
            </div>
            <div className="flex flex-col gap-4 border-gray-700 rounded-lg p-4  ">
                <div className="flex flex-row gap-2">
                </div>
                <AccountsGridShort netizens={netizens} />
            </div>
        </>
    );
}
