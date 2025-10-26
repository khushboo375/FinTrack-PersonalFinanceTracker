import React, { useEffect, useState } from "react";
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

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      if (!user) return;

      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/transaction`)
      );

      const allTransactions = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allTransactions.push({ id: doc.id, ...data });
      });

      // Sort by latest first
      const sorted = allTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sorted);
      toast.success("Transactions fetched successfully!");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to fetch transactions!");
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  return (
    <div className="transactions-page">
      <Header />
      <div className="transactions-content">
        <TransactionsTable
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
      </div>
    </div>
  );
}

export default Transactions;
