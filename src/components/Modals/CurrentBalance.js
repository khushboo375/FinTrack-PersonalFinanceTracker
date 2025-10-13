import React from "react";
import { Button, Modal, Form, Input } from "antd";

function CurrentBalanceModal({
  isBalanceModalVisible,
  handleBalanceCancel,
  onResetBalance,
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Reset Balance"
      visible={isBalanceModalVisible}
      onCancel={handleBalanceCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onResetBalance(Number(values.balance));
          form.resetFields();
        }}
      >
        <Form.Item
          label="New Balance"
          name="balance"
          rules={[{ required: true, message: "Please enter the new balance!" }]}
        >
          <Input type="number" className="custom-layout" />
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-black" htmlType="submit">
            Reset Balance
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CurrentBalanceModal;
