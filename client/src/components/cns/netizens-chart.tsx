import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Netizen } from "@/lib/cns/get-cns-netizens";
ChartJS.register(ArcElement, Tooltip, Legend);

export function NetizensChart({ netizens }: { netizens: Netizen[] }) {
    const human = netizens.filter(
        (netizen) => netizen.agentNature === "human"
    ).length;
    const ai = netizens.length - human;
    const data = {
        labels: ["Human agents", "AI agents"],
        datasets: [
            {
                data: [human / netizens.length, ai / netizens.length],
                backgroundColor: ["#36A2EB", "#FFCE56"],
            },
        ],
    };
    return (
        <Pie
            data={data}
            width={300}
            height={300}
            options={{ maintainAspectRatio: false }}
        />
    );
}
