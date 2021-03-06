import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Radio } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
import ServerStore from '../../../../stores/serverStore';
//import { CreateServerInput } from '../../../../services/server/dto/CreateServerInput';
//import { UpdateServerInput } from '../../../../services/server/dto/UpdateServerInput';

interface ServersProps {
  isCreate: boolean;
  serverData: any;
  isEdit: boolean;
  serverStore: ServerStore;
}

interface ServerStates {
  loading: boolean;
  visible: boolean;
  _serverData: any;
  formRef: any;
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
    formRef : React.createRef<any>(),
  };

  componentDidMount() {
    this.setState({});
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    //
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false});
    }, 500);
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

  render() {
    
    const { visible, loading } = this.state;
    const config: any = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
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
          transitionName='fade'
          title={this.props.isCreate ? 'Create a new servers' : 'Edit server'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={[
            <Button form="form" key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form ref={this.state.formRef} id="form" {...this.layout} name="form" validateMessages={this.validateMessages}>
            <Form.Item
              initialValue={this.state._serverData.name ? `${this.state._serverData.name}` : ``}
              name="name"
              label="Server Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={this.state._serverData.ipAddress ? `${this.state._serverData.ipAddress}` : ``}
              name="ipAddress"
              label="IpAddress"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="startDate" label="StartDate" {...config}>
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item name="endDate" label="EndDate" {...config}>
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            {this.props.isEdit ? (
              <Form.Item name='radiogroup' label="Status">
                <Radio.Group defaultValue = {this.state._serverData.isActive}>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </>
    );
  }
}
