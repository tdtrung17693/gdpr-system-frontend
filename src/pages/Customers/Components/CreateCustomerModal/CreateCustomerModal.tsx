import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Select } from 'antd';

export default class CreateCustomerModal extends Component {
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    loading: false,
    visible: false,
    active: true,
    activeText: 'Active',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  triggerStatus = (e: any) => {
    if (this.state.active){
      this.setState({
        active: false,
        activeText: 'Inactive',
      })
    }
    else{
      this.setState({
        active: true,
        activeText: 'Active',
      })
    };
  }
  //form

  
  FormItem = Form.Item;

  layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };

  validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not validate email!',
      number: '${label} is not a validate number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  onFinish = (values: any) => {
    console.log(values);
  };
  render() {
    const { visible, loading } = this.state;
    const { TextArea } = Input;
    const { Option } = Select;

    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          Create new Customer
        </Button>
        <Modal
          visible={visible}
          title="Create new Customer"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form {...this.layout} layout="vertical" name="nest-messages" onFinish={this.onFinish} validateMessages={this.validateMessages}>
            <Form.Item name={['user', 'name']} label="Customer Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Date Range" rules={[{ required: true }]}>
              <Input.Group compact>
                <DatePicker name='contractBeginDate' style={{ width: '50%' }} />
                <DatePicker name='contractEndDate' style={{ width: '50%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name={['user', 'contactPoint']} label="Contact Point" rules={[{ type: 'email' }, { required: true }]}>
              <Select defaultValue="lucy" style={{ width: '100%' }}>
                <Option value="jack">Jack</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['user', 'description']} label="Description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name={['user', 'status']} label="Status">
              <Button defaultValue='Active' onClick={this.triggerStatus}>{this.state.activeText}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
