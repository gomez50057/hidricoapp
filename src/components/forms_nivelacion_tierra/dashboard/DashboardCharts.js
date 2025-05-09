"use client";

import React, { useEffect, useState } from "react";
import styles from "./DashboardCharts.module.css";
import { Bar, Radar, PolarArea, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";

// Registrar elementos para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const DashboardCharts = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/dashboard/stats/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  if (!stats) {
    return <p className={styles.loading}>Cargando datos...</p>;
  }

  // Radar Chart: Acuerdos por Zona Metropolitana (ZM)
  const radarData = {
    labels: stats.acuerdos.por_zm.map((item) => item.zm),
    datasets: [
      {
        label: "Total de Acuerdos",
        data: stats.acuerdos.por_zm.map((item) => item.total),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Stacked Bar Chart: Acuerdos por Estatus
  const barData = {
    labels: stats.acuerdos.por_estatus.map((item) => item.estatus),
    datasets: [
      {
        label: "Acuerdos",
        data: stats.acuerdos.por_estatus.map((item) => item.total),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        borderRadius: 10,
      },
    ],
  };

  // Polar Area: Distribución de Acuerdos por Comisión
  const polarData = {
    labels: stats.acuerdos.por_comision.map((item) => item.comision),
    datasets: [
      {
        label: "Acuerdos",
        data: stats.acuerdos.por_comision.map((item) => item.total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9966FF",
          "#E7E9ED",
          "#3E95CD",
        ],
      },
    ],
  };

  // Bubble Chart: Actualizaciones por Estado
  const bubbleData = {
    datasets: stats.actualizaciones.por_estado.map((item, index) => ({
      label: item.estado,
      data: [
        {
          x: index * 10,
          y: item.total,
          r: item.total / 2, // El tamaño de la burbuja se basa en la cantidad de actualizaciones
        },
      ],
      backgroundColor: `rgba(${index * 50}, ${200 - index * 30}, ${150}, 0.5)`,
    })),
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}><span>Indicadores</span> de Acuerdos</h2>
      <div className={styles.chartTotalAgreements}>
        <h3>📊 Total de Acuerdos</h3>
        <p className={styles.totalNumber}>{stats.acuerdos.total}</p>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <h3>Acuerdos por Estatus</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>

        <div className={styles.chart}>
          <h3>Acuerdos por Zona Metropolitana</h3>
          <Radar data={radarData} options={{ responsive: true }} />
        </div>

        <div className={styles.chart}>
          <h3>Distribución por Comisión</h3>
          <PolarArea data={polarData} options={{ responsive: true }} />
        </div>

        <div className={styles.chart}>
          <h3>Actualizaciones por Estado</h3>
          <Bubble data={bubbleData} options={{ responsive: true, scales: { x: { beginAtZero: true }, y: { beginAtZero: true } } }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
