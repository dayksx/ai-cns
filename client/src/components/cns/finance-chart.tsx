import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function FinanceChart() {
    const data = {
        labels: ["Infrastructure", "Grants & Growth", "Reserves", "Operations", "Public Goods"],
        datasets: [
            {
                label: "Finance Distribution",
                data: [30, 25, 15, 20, 10],
                backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#98FB98"],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} width={300} height={300} />;
}
