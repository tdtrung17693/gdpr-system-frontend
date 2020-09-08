import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Switch } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';

//const [form] =  Form.useForm();

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

@inject(Stores.ServerStore)
@observer
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
            <Button form="form" key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form id="form" {...this.layout} name="form" onFinish={this.onFinish} validateMessages={this.validateMessages}>
            <Form.Item
              initialValue={this.state._serverData.name ? `${this.state._serverData.name}` : ``}
              name={['server', 'name']}
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={this.state._serverData.ipAddress ? `${this.state._serverData.ipAddress}` : ``}
              name={['server', 'ipaddress']}
              label="IpAddress"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={['server', 'startdate']} label="StartDate" rules={[{ type: 'date' }]}>
              <Input.Group compact>
                <DatePicker style={{ width: '100%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name={['server', 'enddate']} label="EndDate" rules={[{ type: 'date' }]}>
              <Input.Group compact>
                <DatePicker style={{ width: '100%' }}/>
              </Input.Group>
            </Form.Item>
            {this.props.isEdit ? (
              <Form.Item name={['server', 'Status']} label="Status">
                {this.state._serverData.status ? (
                  <Switch style={{ width: '25%' }} checkedChildren="active" unCheckedChildren="inactive" defaultChecked />
                ) : (
                  <Switch style={{ width: '25%' }} checkedChildren="active" unCheckedChildren="inactive" />
                )}
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </>
    );
  }
}
