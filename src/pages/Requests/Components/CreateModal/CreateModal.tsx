import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, TimePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

export default class CreateModal extends Component {
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
          Create a new request
        </Button>
        <Modal
          visible={visible}
          title="Create new request"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Submit
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          
          <Form {...this.layout} name="nest-messages" onFinish={this.onFinish} validateMessages={this.validateMessages}>
            <Form.Item name={'title'} label="Title" rules={[{ required: true }]} >
              <Input />
            </Form.Item>
            <Form.Item name={'fromDate'} label="From Date" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 15px)' }}
              >
                <DatePicker />
              </Form.Item>
              <span
                style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
              >
              </span>
              <Form.Item name={'fromDateTime'}rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(50% - 15px)' }} >
                <TimePicker />
              </Form.Item>
            </Form.Item>
            <Form.Item name={'toDate'} label="To Date" rules={[{ required: true }]} style={{ marginBottom: 0 }} >
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 15px)' }}
              >
                <DatePicker />
              </Form.Item>
              <span
                style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
              >
              </span>
              <Form.Item name={'toDateTime'} rules={[{ required: true }]} style={{ display: 'inline-block', width: 'calc(50% - 15px)' }} >
                <TimePicker />
              </Form.Item>
            </Form.Item>
            <Form.Item name={'server'} label="Server" rules={[{ required: true }]} >
              <Input />
            </Form.Item>
            <Form.Item name={'description'} label="Description" >
              <TextArea/>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
