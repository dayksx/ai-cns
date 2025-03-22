import { FunctionComponent, useEffect, useState } from "react";
import { getCnsNetizens, Netizen } from "@/lib/cns/get-cns-netizens";
import { AccountCardShort } from "@/components/userprofile/account-card-short";

export const AllNetizens: FunctionComponent = () => {
    const [netizens, setNetizens] = useState<Netizen[]>([]);

    useEffect(() => {
        getCnsNetizens().then((netizens) => {
            setNetizens(netizens);
            console.log(netizens.map((n) => n.address));
        });
    }, []);

    return (
        <div className="flex flex-col items-center px-8 py-12">
            {/* Title Section */}
            <div className="w-full text-center mb-8">
                <h1 className="text-4xl font-bold text-white">
                    🌐 Discover Netizens
                </h1>
                <p className="text-gray-400 mt-2">
                    Explore the profiles of our amazing netizens.
                </p>
                <div className="mt-6 w-24 border-b-4 border-blue-500 mx-auto"></div>{" "}
                {/* Subtle divider */}
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 max-w-screen-xl w-full">
                {netizens.map((netizen) => (
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
};
