import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Cards from "../components/Cards";
import TransactionsTable from "../components/TransactionsTable";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import CurrentBalanceModal from "../components/Modals/CurrentBalance";
import NoTransactions from "../components/NoTransactions";
import ChartComponent from "../components/Charts";
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from "moment";
import { db, auth } from '../firebase';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";
import "./Dashboard.css"; 

function Dashboard() {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isBalanceModalVisible, setIsBalanceModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const showBalanceModal = () => {
    setIsBalanceModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const handleBalanceCancel = () => {
    setIsBalanceModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().name || "User");
          } else {
            setUserName("User");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUserName("User");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  async function addTransaction(transaction){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }catch (e){
      console.error("Error adding document");
      toast.error("Couldn't Add Transaction!");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      calculateBalance();
    }
  }, [transactions]);

  const handleResetBalance = (newBalance) => {
    setTotalBalance(newBalance);  // ✅ directly reset balance
    setExpense(0);                // optional: reset expenses
    setIncome(newBalance);        // optional: set as "income"
    setTransactions([]);          // optional: clear old transactions
    setIsBalanceModalVisible(false);
  };

  async function fetchTransactions() {
  setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transaction`));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const transactionsArray = [];
          querySnapshot.forEach((docSnap) => {
            transactionsArray.push({
              ...docSnap.data(),
              id: docSnap.id,       // ✅ get document ID
              userId: user.uid,     // ✅ include user ID
            });
          });
          setTransactions(transactionsArray);
          toast.success("Transactions Fetched");
        } else {
          setTransactions([]); // No transactions
          // toast.info("No transactions found.");
        }
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        toast.error("Failed to fetch transactions.");
      }
    }
    setLoading(false);
  };

  let sortedTransactions = transactions.sort((a,b) => {
    return new Date(a.date) - new Date(b.date);
  });


  return (
    <div className="dashboard-container">   {/* ✅ wrapper with black bg */}
      <Header />
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h2>Hello, {userName} 👋</h2>
        <h2>Welcome to FinTrack! Track your income, expenses, and savings all in one place.</h2>
      </div>
      <Cards 
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        showBalanceModal={showBalanceModal}
      />
      {transactions && transactions.length!==0 ? (
        <ChartComponent sortedTransactions={sortedTransactions}/>
      ) : (<NoTransactions/>)}
      <AddExpenseModal 
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal 
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable 
        transactions={transactions}
        fetchTransactions={fetchTransactions} 
      />
      <div style={{ textAlign: "center", margin: "30px 0", fontWeight: "bold" }}>
        <h3>✨ Thank you for using <span style={{ color: "#1890ff" }}>FinTrack</span> — your wallet is already writing us a thank-you note. ✨</h3>
      </div>
      <CurrentBalanceModal
        isBalanceModalVisible={isBalanceModalVisible}
        handleBalanceCancel={handleBalanceCancel}
        onResetBalance={handleResetBalance}
      />
    </div>
  );
}


export default Dashboard;
