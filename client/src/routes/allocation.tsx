import { useEffect } from "react";
import { getInitiatives } from "../contracts/get-initiatives";
import { useState } from "react";
import { PageHeader } from "../components/page-header";
import { InitiativeCapitalAllocation } from "../components/cns/initiative-capital-allocation";

export default function CapitalAllocation() {
    const [capitalAllocation, setCapitalAllocation] = useState<any[]>([]);

    useEffect(() => {
        getInitiatives().then((initiatives) => {
            //FIXME change status for CAPITAL_ALLOCATION
            setCapitalAllocation(
                initiatives?.filter(
                    (initiative) => initiative.status === "IDEATION"
                )
            );
        });
    }, []);

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Capital Allocation" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {capitalAllocation.map((a) => {
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
