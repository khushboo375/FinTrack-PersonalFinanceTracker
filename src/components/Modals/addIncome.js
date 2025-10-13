import React from 'react';
import { Button, Modal, Form, Input, DatePicker, Select } from 'antd';

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Income"
      visible={isIncomeModalVisible} // ✅ corrected
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, 'income'); // ✅ corrected
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name of the income' }]}
        >
          <Input type="text" className="custom-layout" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input the income amount!' }]}
        >
          <Input type="number" className="custom-layout" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select the income date!' }]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: 'Please select a tag!' }]}
        >
          <Select className="select-input-2">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-black"  htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
