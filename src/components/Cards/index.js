import React from 'react';
import "./styles.css";
import { Card, Row } from 'antd';
import Button from "../Button";

export default function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal, showBalanceModal }) {
  return (
    <div>
      <Row className="my-row">
        {/* Balance Card */}
        <Card className="my-card balance-card" title="Current Balance">
          <h2 className="amount">₹ {totalBalance}</h2>
          <Button text="Reset Balance" onClick={showBalanceModal} />
        </Card>

        {/* Income Card */}
        <Card className="my-card income-card" title="Income">
          <h2 className="amount">₹ {income}</h2>
          <Button text="Add Income" onClick={showIncomeModal} />
        </Card>

        {/* Expense Card */}
        <Card className="my-card expense-card" title="Expenses">
          <h2 className="amount">₹ {expense}</h2>
          <Button text="Add Expense" onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}
