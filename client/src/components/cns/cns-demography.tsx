import { Netizen } from "../../lib/cns/get-cns-netizens";
import { Address } from "./address";
import { NetizensChart } from "./netizens-chart";

export function CnsDemography({ netizens }: { netizens: Netizen[] }) {
    return (
        <>
            <div className="flex flex-row items-end gap-2">
                <span className="text-6xl font-bold text-blue-500">
                    {netizens?.length}
                </span>
                <span className="text-2xl font-bold text-blue-200">
                    Netizens
                </span>
            </div>
            <div>
                <NetizensChart netizens={netizens} />
            </div>
            <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
                <div className="flex flex-row gap-2">
                    <span className="text-xl font-bold">Demography</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        {netizens.map((netizen) => {
                            return (
                                <div
                                    key={netizen.address}
                                    className="grid grid-cols-4 gap-1"
                                >
                                    <div>
                                        <Address
                                            address={netizen.address}
                                            showFullAddress={false}
                                        />
                                    </div>
                                    <div className="capitalize">
                                        {netizen.profileType}
                                    </div>
                                    <div className="capitalize">
                                        {netizen.agentNature}
                                    </div>
                                    <div className="capitalize">
                                        Verax attestation
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
