import React, { useState } from "react";
import {
  Table,
  Select,
  Radio,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { db } from "../../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import "./styles.css";

const { Option } = Select;

function TransactionsTable({ transactions, fetchTransactions }) {
  // State for search input, filter, and sorting
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // State and form control for the edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [form] = Form.useForm();

  // Deletes a transaction from Firebase
  const handleDelete = async (record) => {
    try {
      await deleteDoc(doc(db, `users/${record.userId}/transaction`, record.id));
      toast.success("Transaction deleted!");
      fetchTransactions(); // Refresh data after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction!");
    }
  };

  // Opens edit modal and populates form with selected transaction
  const handleEdit = (record) => {
    setEditingTransaction(record);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      ...record,
      date: moment(record.date, "YYYY-MM-DD"),
    });
  };

  // Updates transaction in Firebase after editing
  const handleUpdate = async (values) => {
    try {
      const updatedTransaction = {
        ...editingTransaction,
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      await updateDoc(
        doc(db, `users/${editingTransaction.userId}/transaction`, editingTransaction.id),
        updatedTransaction
      );

      toast.success("Transaction updated!");
      setIsEditModalVisible(false);
      fetchTransactions(); // Refresh data after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction!");
    }
  };

  // Columns configuration for Ant Design Table
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <EditOutlined
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleEdit(record)}
        />
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleDelete(record)}
        />
      ),
    },
  ];

  // Apply search and type filter to transactions
  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || item.type === typeFilter)
  );

  // Sort filtered transactions by selected key
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const exportToCsv = () => {
    const headers = ["Name", "Amount", "Tag", "Type", "Date"];

    const rows = sortedTransactions.map((t) => [
      t.name,
      t.amount,
      t.tag,
      t.type,
      t.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully!");
  };

  return (
    <div id="transactions-container">
      <h2>My Transactions</h2>

      {/* Filter controls */}
      <div id="transactions-controls">
        <div className="transactions-left">
          <input
            className="transactions-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            type="text"
          />

          <Select
            className="transactions-filter"
            onChange={(value) => setTypeFilter(value)}
            value={typeFilter}
            placeholder="Filter by Type"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>

          <Radio.Group
            className="transactions-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        </div>

        <div className="transactions-actions">
          <button className="btn" onClick={exportToCsv}>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Transactions table */}
      <Table
        dataSource={sortedTransactions}
        columns={columns}
        rowKey={(record) => record.id}
      />

      {/* Modal for editing transactions */}
      <Modal
        title="Edit Transaction"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="tag" label="Tag" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TransactionsTable;
