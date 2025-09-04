import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Chart2D() {
  const data = {
    labels: ["A", "B", "C"],
    datasets: [{ label: "Sample", data: [12, 19, 3], backgroundColor: "blue" }]
  };
  return <Bar data={data} />;
}

export default Chart2D;
