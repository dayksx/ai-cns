import { useEffect, useState } from "react";
import { getInitiatives } from "../contracts/get-initiatives";
import { PageHeader } from "../components/page-header";
import { InitiativeCapitalAllocation } from "../components/cns/initiative-capital-allocation";

export default function CapitalAllocation() {
    const [capitalAllocation, setCapitalAllocation] = useState<any[]>([]);

    useEffect(() => {
        getInitiatives().then((initiatives) => {
            const filteredInitiatives = initiatives?.filter(
                (initiative) => initiative.status === "CAPITAL_ALLOCATION"
            );
            setCapitalAllocation(filteredInitiatives || []);
        });
    }, []);

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Resource Allocation" />
                <div className="flex flex-col gap-6 mt-6">
                    {capitalAllocation.length > 0 ? (
                        capitalAllocation.map((initiative) => {
                            return (
                                <div
                                    key={initiative.initiativeId}
                                    className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-500 transition duration-300"
                                >
                                    <InitiativeCapitalAllocation initiative={initiative} />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center mt-6 text-lg">
                            No capital allocations available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
