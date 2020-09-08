import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Switch } from 'antd';

interface ServersProps {
  isCreate: boolean;
  serverData: any;
  isEdit: boolean;
}

interface ServerStates {
  loading: boolean;
  visible: boolean;
  _serverData: any;
}
export default class CreateOrEditServerModal extends Component<ServersProps, ServerStates> {
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    _serverData: this.props.serverData,
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
        {/* <Button type="primary" onClick={this.showModal}>
          {this.props.isCreate ? 'Create a new servers' : 'Edit'}
        </Button> */}
        {this.props.isCreate ? (
          <Button type="primary" onClick={this.showModal}>
            Create a new servers
          </Button>
        ) : (
          <Button shape="round" danger onClick={this.showModal}>
            Edit
          </Button>
        )}
        <Modal
          visible={visible}
          title={this.props.isCreate ? 'Create a new servers' : 'Edit server'}
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
          <Form {...this.layout} name="nest-messages" onFinish={this.onFinish} validateMessages={this.validateMessages}>
            <Form.Item
              initialValue={this.state._serverData.name ? `${this.state._serverData.name}` : ``}
              name={['user', 'name']}
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={this.state._serverData.ipAddress ? `${this.state._serverData.ipAddress}` : ``}
              name={['user', 'ipaddress']}
              label="IpAddress"
              rules={[{ type: 'email' }, { required: true }]}
            >
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
            {this.props.isEdit ? (
              <Form.Item name={['user', 'Status']} label="Status" rules={[{ required: true }]}>
                {this.state._serverData.status ? (
                  <Switch  style = {{width : '25%'}}  checkedChildren="active" unCheckedChildren="inactive" defaultChecked />
                ) : (
                  <Switch  style = {{width : '25%'}}  checkedChildren="active" unCheckedChildren="inactive" />
                )}
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </>
    );
  }
}
