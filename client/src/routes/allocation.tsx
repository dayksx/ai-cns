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
        <div className="flex flex-col w-full h-[100dvh] p-6">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Resource Allocation" />
                <div className="flex flex-col gap-6">
                    {capitalAllocation.length > 0 ? (
                        capitalAllocation.map((initiative, index) => {
                            if (index <= 2) {
                                initiative.balance =
                                    initiative.balance === 0
                                        ? initiative.balance
                                        : 1252600000000000000 *
                                          (index + 1) *
                                          1.333;
                            }
                            return (
                                <div
                                    key={initiative.initiativeId}
                                    className="p-4 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
                                >
                                    <InitiativeCapitalAllocation
                                        initiative={initiative}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center mt-6">
                            No capital allocations available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
