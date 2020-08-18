import React, { useState, useEffect, useRef } from "react";
import ChartJS from "chart.js";
import { getEUR, getUSD } from "../../api";
import "./Main.css";

ChartJS.pluginService.register({
  beforeDraw: function (chart) {
    if (
      chart.config.options.chartArea &&
      chart.config.options.chartArea.backgroundColor
    ) {
      let ctx = chart.chart.ctx;
      let chartArea = chart.chartArea;

      ctx.save();
      ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
      ctx.fillRect(
        chartArea.left,
        chartArea.top,
        chartArea.right - chartArea.left,
        chartArea.bottom - chartArea.top
      );
      ctx.restore();
    }
  },
});

const interval = 3000;
const arrLength = 10;

const Main = () => {
  const chartRef = useRef();

  const [rates, setRates] = useState([]);

  const getRates = async () => {
    const eur = await getEUR();
    const usd = await getUSD();

    const res = [...rates];

    const date = new Date(Date.now()).toLocaleTimeString();

    res.push({ date: date, eur: eur, usd: usd });

    if (res.length > arrLength) {
      res.splice(0, 1);
    }

    setRates(res);
  };

  useEffect(() => {
    getRates();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => getRates(), interval);

    return () => clearTimeout(timer);
  }, [rates]);

  useEffect(() => {
    if (chartRef.current?.getContext("2d")) {
      const labels = [];
      const eurs = [];
      const usds = [];

      rates.forEach((item) => {
        labels.push(item.date);
        eurs.push(item.eur);
        usds.push(item.usd);
      });

      new ChartJS(chartRef.current?.getContext("2d"), {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "EUR",
              data: eurs,
              borderColor: ["rgba(255, 0, 0, 1)"],
            },
            { label: "USD", data: usds, borderColor: ["rgba(0, 0, 255, 1)"] },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            enabled: false,
          },
          scales: {
            yAxes: [
              {
                type: "linear",
                position: "left",
                scaleLabel: {
                  display: true,
                  labelString: "RUB",
                },
              },
            ],
            xAxes: [
              {
                type: "category",
              },
            ],
          },
        },
      });
    }
  }, [rates]);

  return (
    <div className="main">
      <div className="chart">
        <canvas ref={chartRef} />
      </div>
      <table className="tbl" align="center" border="1">
        <thead>
          <tr className="tbl-head">
            <th className="tbl-cell">№</th>
            <th className="tbl-cell">Time</th>
            <th className="tbl-cell">EUR</th>
            <th className="tbl-cell">USD</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, i) => {
            return (
              <tr key={i} className="tbl-row">
                <td className="tbl-cell">{i + 1} </td>
                <td className="tbl-cell">{rate.date}</td>
                <td className="tbl-cell">{rate.eur}</td>
                <td className="tbl-cell">{rate.usd}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Main;
