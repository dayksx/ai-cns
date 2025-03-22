import { useEffect } from "react";
import { getInitiatives } from "../contracts/get-initiatives";
import { useState } from "react";
import { PageHeader } from "../components/page-header";
import { InitiativeCapitalAllocation } from "../components/cns/initiative-capital-allocation";

export default function CapitalAllocation() {
    const [capitalAllocation, setCapitalAllocation] = useState<any[]>([]);

    useEffect(() => {
        getInitiatives().then((initiatives) => {
            initiatives = initiatives?.filter(
                (initiative) => initiative.status === "CAPITAL_ALLOCATION"
            );
            setCapitalAllocation(initiatives);
            console.log(initiatives);
        });
    }, []);

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Resource Allocation" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {capitalAllocation.map((a, i) => {
                            // temp for demo, fake balance
                            if (i <= 2) {
                                a.balance =
                                    a.balance === 0
                                        ? a.balance
                                        : 1252600000000000000 * (i + 1) * 1.333;
                            }
                            return (
                                <InitiativeCapitalAllocation
                                    key={a.initiativeId}
                                    initiative={a}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
