import { useEffect } from "react";
import { useState } from "react";
import { ActivitiesColumn } from "./cns-activities-column";
import { getInitiatives } from "../../contracts/get-initiatives";

export function CnsActivities() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [capitalAllocation, setCapitalAllocation] = useState<any[]>([]);
    const [ongoing, setOngoing] = useState<any[]>([]);

    useEffect(() => {
        getInitiatives().then((initiatives) => {
            setIdeas(
                initiatives?.filter(
                    (initiative) => initiative.status === "IDEATION"
                )
            );
            setCapitalAllocation(
                initiatives?.filter(
                    (initiative) => initiative.status === "CAPITAL_ALLOCATION"
                )
            );
            setOngoing(
                initiatives?.filter(
                    (initiative) => initiative.status === "BUILDING"
                )
            );
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 rounded-lg p-4  ">
            <span className="text-xl font-semibold text-gray-600 uppercase border-b pb-1s">Activities</span>
            <div className="grid grid-cols-3 gap-4">
                <ActivitiesColumn title="Ideas" activities={ideas} />
                <ActivitiesColumn
                    title="Resources Allocation"
                    activities={capitalAllocation}
                />
                <ActivitiesColumn title="Building" activities={ongoing} />
            </div>
        </div>
    );
}
