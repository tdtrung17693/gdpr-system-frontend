import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Radio } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
//import ServerStore from '../../../../stores/serverStore';
//import { CreateServerInput } from '../../../../services/server/dto/CreateServerInput';
//import { UpdateServerInput } from '../../../../services/server/dto/UpdateServerInput';
import { GetServerOutput } from '../../../../services/server/dto/GetServerOutput';
import { FormInstance } from 'antd/lib/form';
//import { CreateServerInput } from '../../../../services/server/dto/CreateServerInput';

interface ServersProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onSave: (user: GetServerOutput | null, errors: any) => void;
}

interface ServerStates {
  loading: boolean;
}

@inject(Stores.ServerStore)
@observer
export default class CreateOrUpdateModal extends Component<ServersProps, ServerStates> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    loading: false,
  };

  componentDidMount() {
    this.setState({});
  }

  public setFieldsValues = (server: GetServerOutput) => {
    this.setState({}, () => {
      this.formRef.current?.setFieldsValue({
        Name: server?.Name,
        IpAddress: server?.IpAddress,
        // startDate: server?.startDate,
        // endDate: server?.endDate,
        Status: server?.Status,
      });
    });
  };

  handleOk = () => {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        console.log(values);
        let valuesUpdate: any = {
          ...values,
          StartDate: values.StartDate.format('YYYY-MM-DD HH:mm:ss'),
          EndDate: values.EndDate.format('YYYY-MM-DD HH:mm:ss'),
          UpdatedBy: 'B461CC44-92A8-4CC4-92AD-8AB884EB1895',  
        };
        console.log(valuesUpdate);
        this.props.onSave(valuesUpdate, null);
      })
      .catch((errors) => {
        this.props.onSave(null, errors);
      });
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
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
    const { loading } = this.state;
    const { visible, onCancel, modalType } = this.props;

    const config: any = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };

    return (
      <>
        <Modal
          visible={visible}
          title={modalType === 'edit' ? 'Edit Server' : 'Create a new Server'}
          onOk={this.handleOk}
          onCancel={onCancel}
          footer={[
            <Button form="form" key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form ref={this.formRef} id="form" {...this.layout} name="form" validateMessages={this.validateMessages}>
            <Form.Item name="Name" label="Server Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="IpAddress" label="IpAddress" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="StartDate" label="StartDate" {...config}>
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item name="EndDate" label="EndDate" {...config}>
              <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            {this.props.modalType === 'edit' ? (
              <Form.Item name="Status" label="Status">
                <Radio.Group>
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
