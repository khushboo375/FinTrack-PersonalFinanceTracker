// src/components/NoTransactions.js
import React from "react";
import transactions from "../assets/transactions.webp";

function NoTransactions() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "1rem",
      }}
    >
      <img src={transactions} style={{ width: "300px" }} />
      <p style={{ textAlign: "center", fontSize: "1 rem" }}>
        You have NO Transactions currently
      </p>
    </div>
  );
}

export default NoTransactions;
