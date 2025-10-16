import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import TransactionsTable from "../components/TransactionsTable";
import { toast } from "react-toastify";
import "./Transactions.css";

function Transactions() {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  // ✅ Fetch all transactions from Firestore
  const fetchTransactions = async () => {
    try {
      if (!user) return;

      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/transaction`)
      );

      const allTransactions = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Normalize the date — handle both string and Firestore timestamp
        let dateString;
        if (data.date?.seconds) {
          // Firestore Timestamp
          dateString = moment(data.date.toDate()).format("YYYY-MM-DD");
        } else {
          dateString = moment(data.date).format("YYYY-MM-DD");
        }

        allTransactions.push({ id: doc.id, ...data, date: dateString });
      });

      // Sort by latest first
      const sorted = allTransactions.sort(
        (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
      );

      setTransactions(sorted);
      setFilteredTransactions(sorted);
      toast.success("Transactions fetched successfully!");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to fetch transactions!");
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  // ✅ Apply month + week filters properly
  useEffect(() => {
    if (!transactions.length) return;

    let filtered = [...transactions];

    // Month filter
    if (selectedMonth) {
      filtered = filtered.filter((t) => {
        const txDate = moment(t.date, "YYYY-MM-DD");
        return txDate.isSame(selectedMonth, "month");
      });
    }

    // Week filter
    if (selectedWeek) {
      const startOfWeek = moment(selectedWeek).startOf("week");
      const endOfWeek = moment(selectedWeek).endOf("week");

      filtered = filtered.filter((t) => {
        const txDate = moment(t.date, "YYYY-MM-DD");
        return txDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
      });
    }

    setFilteredTransactions(filtered);
  }, [selectedMonth, selectedWeek, transactions]);

  return (
    <div className="transactions-page">
      {/* ✅ Navbar always visible */}
      <Header />

      <div className="transactions-content">
        <h1 className="transactions-title">
          Select Month and Week for Transactions
        </h1>

        {/* ✅ Filter section (unchanged UI) */}
        <div className="filter-bar">
          <div className="filter-controls">
            <div className="filter-item">
              <label>Filter by Month:</label>
              <DatePicker
                picker="month"
                onChange={(value) => setSelectedMonth(value)}
                value={selectedMonth}
                placeholder="Select Month"
              />
            </div>

            <div className="filter-item">
              <label>Filter by Week:</label>
              <DatePicker
                picker="week"
                onChange={(value) => setSelectedWeek(value)}
                value={selectedWeek}
                placeholder="Select Week"
              />
            </div>

            {(selectedMonth || selectedWeek) && (
              <button
                className="clear-filter-btn"
                onClick={() => {
                  setSelectedMonth(null);
                  setSelectedWeek(null);
                  setFilteredTransactions(transactions);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ✅ Transactions Table */}
        <TransactionsTable
          transactions={filteredTransactions}
          fetchTransactions={fetchTransactions}
        />
      </div>
    </div>
  );
}

export default Transactions;
