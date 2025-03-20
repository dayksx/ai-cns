import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export function FinanceChart() {
    const data = {
        labels: ["Build", "Invest", "“Support”", "Legal"],
        datasets: [
            {
                data: [50, 25, 5, 20],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#98FB98"],
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
