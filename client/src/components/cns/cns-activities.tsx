import { useEffect } from "react";
import { useState } from "react";
import { ActivitiesColumn } from "./cns-activities-column";
import { getInitiatives } from "../../contracts/get-initiatives";

export function CnsActivities() {
    const [initiatives, setInitiatives] = useState<any[]>([]);
    const [ideas, setIdeas] = useState<any[]>([]);
    const [capitalFormation, setCapitalFormation] = useState<any[]>([]);
    const [ongoing, setOngoing] = useState<any[]>([]);

    useEffect(() => {
        getInitiatives().then((initiatives) => {
            console.log("HERE");
            setInitiatives(initiatives);
            console.log(initiatives);
            setIdeas(
                initiatives?.filter(
                    (initiative) => initiative.status === "IDEATION"
                )
            );
            setCapitalFormation(
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
        <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
            <span className="text-xl font-bold">Activities</span>
            <div className="grid grid-cols-3 gap-4">
                <ActivitiesColumn title="Ideas" activities={ideas} />
                <ActivitiesColumn title="Capital Allocation" activities={[]} />
                <ActivitiesColumn title="Building" activities={[]} />
            </div>
        </div>
    );
}
