import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./reports.css";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${userId}/transaction`)
        );
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [userId]);

  // filter transactions by selected month & year
  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === parseInt(selectedMonth) &&
          d.getFullYear() === parseInt(selectedYear)
        );
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, selectedMonth, selectedYear]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalSavings = Math.max(totalIncome - totalExpenses, 0);

  const chartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
    { name: "Savings", amount: totalSavings },
  ];

  return (
    <div>
      <Header />

      <div className="reports-container">
        {/* Month & Year Selection */}
        <div className="filter-box">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Show loading or results */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px", color: "black" }}>
            🚫 No data found for this month
          </p>
        ) : (
          <>
            {/* Summary Boxes */}
            <div className="summary-boxes">
              <div className="summary-card">
                <h3>Total Income</h3>
                <p>₹{totalIncome}</p>
              </div>
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p>₹{totalExpenses}</p>
              </div>
              <div className="summary-card">
                <h3>Total Savings</h3>
                <p>
                  {totalIncome - totalExpenses >= 0
                    ? `₹${totalSavings}`
                    : "₹0 (More spending than income)"}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-box">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#1890ff" />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                {/* Transactions Table */}
                <div className="table-box">
                <h3 style={{ marginBottom: "15px" }}>Transactions</h3>
                <table className="summary-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Tag</th>
                        <th>Type</th>
                        <th>Amount (₹)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.map((t) => (
                        <tr key={t.id}>
                        <td>{t.date}</td>
                        <td>{t.name}</td>
                        <td>{t.tag}</td>
                        <td>{t.type}</td>
                        <td>{t.amount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
