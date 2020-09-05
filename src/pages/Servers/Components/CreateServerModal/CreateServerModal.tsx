import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker } from 'antd';

export default class CreateServerModal extends Component {
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    loading: false,
    visible: false,
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

  //form

  FormItem = Form.Item;

  layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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

    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          Create a new server
        </Button>
        <Modal
          visible={visible}
          title="Create new server"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Form.Item wrapperCol={{ ...this.layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>,
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form {...this.layout} name="nest-messages" onFinish={this.onFinish} validateMessages={this.validateMessages}>
            <Form.Item name={['user', 'name']} label="Server Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['user', 'ipaddress']} label="IpAddress" rules={[{ type: 'email' }, { required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['user', 'startdate']} label="StartDate" rules={[{ required: true }]}>
              <Input.Group compact>
                <DatePicker style={{ width: '100%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name={['user', 'enddate']} label="EndDate" rules={[{ required: true }]}>
              <Input.Group compact>
                <DatePicker style={{ width: '100%' }} />
              </Input.Group>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
