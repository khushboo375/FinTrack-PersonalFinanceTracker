import React from "react";
import TransactionsTable from "../components/TransactionsTable";
import "./Transactions.css";

function Transactions({ transactions = [], fetchTransactions }) {
  return (
    <div className="transactions-page">
      <h2>All Transactions</h2>
      {/* Only render when transactions exist */}
      <TransactionsTable
        transactions={transactions}
        fetchTransactions={fetchTransactions}
      />
    </div>
  );
}

export default Transactions;
