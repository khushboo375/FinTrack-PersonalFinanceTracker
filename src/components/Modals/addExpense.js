import React from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
  currentBalance, // ✅ pass current balance as prop
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Expense"
      visible={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          if (values.amount > currentBalance) {
            message.error("Transaction can't be added. Amount exceeds current balance!");
            return; // stop form submission
          }
          onFinish(values, 'expense');
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name of the transaction' }]}
        >
          <Input type="text" className="custom-layout" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: 'Please input the expense amount!' },
            {
              validator: (_, value) => {
                if (value && value > currentBalance) {
                  return Promise.reject(
                    new Error("Expense amount cannot exceed current balance!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" className="custom-layout" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select the expense date!' }]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: 'Please select a tag!' }]}
        >
          <Select className="select-input-2">
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="bills">Bills</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-black" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
