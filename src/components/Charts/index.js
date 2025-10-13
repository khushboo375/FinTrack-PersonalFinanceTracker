import React from "react";
import { Line, Pie } from "@ant-design/charts";
import "./styles.css";

function ChartComponent({ sortedTransactions }) {
  // Calculate running balance for line chart
  let balance = 0;
  const balanceData = sortedTransactions.map((item) => {
    if (item.type === "income") {
      balance += item.amount;
    } else if (item.type === "expense") {
      balance -= item.amount;
    }
    return { date: item.date, balance };
  });

  // Utility: group transactions by tag and sum
  const groupByTag = (transactions) => {
    const grouped = {};
    transactions.forEach((t) => {
      if (t.tag && t.tag.trim() !== "") {
        grouped[t.tag] = (grouped[t.tag] || 0) + t.amount;
      }
    });
    return Object.entries(grouped).map(([tag, amount]) => ({ tag, amount }));
  };

  // Expense & Income data (clean + grouped)
  const spendingData = groupByTag(
    sortedTransactions.filter((t) => t.type === "expense")
  );
  const incomeData = groupByTag(
    sortedTransactions.filter((t) => t.type === "income")
  );

  // Line chart config
  const config = {
    data: balanceData,
    height: 300,
    autoFit: true,
    xField: "date",
    yField: "balance",
    smooth: true,
    label: { style: { fill: "#aaa" } },
    point: { size: 5, shape: "diamond" },
  };

  // Pie chart config
  const getPieConfig = (data) => ({
    data,
    width: 300,
    height: 300,
    angleField: "amount",
    colorField: "tag",
    radius: 0.9,
    label: {
    content: (item) => {
      // Show nothing if tag is missing
      if (!item?.tag || item.tag.trim() === "") return "";
      // Otherwise show formatted label
      return `${item.tag}: ₹${item.amount}`;
    },
    style: { fontSize: 14, fontWeight: "bold", fill: "#fff" },
    },
    interactions: [{ type: "element-active" }],
    legend: { position: "bottom" },
  });

  return (
    <div className="charts-wrapper">
      <div className="chart-box">
        <h2>Your Balance Analytics</h2>
        <Line {...config} />
      </div>
      <div className="charts-row">
        <div className="chart-box">
          <h2>Your Income</h2>
          <Pie {...getPieConfig(incomeData)} />
        </div>
        <div className="chart-box">
          <h2>Your Expenses</h2>
          <Pie {...getPieConfig(spendingData)} />
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
