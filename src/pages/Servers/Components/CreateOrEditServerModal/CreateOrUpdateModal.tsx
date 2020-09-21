import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Radio } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
//import { GetServerOutput } from '../../../../services/server/dto/GetServerOutput';
import { FormInstance } from 'antd/lib/form';
import { GetServerInput } from '../../../../services/server/dto/GetServerInput';
import moment from 'moment';
import AuthenticationStore from '../../../../stores/authenticationStore';

interface ServersProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onSave: (server: GetServerInput | null, errors: any) => void;
  authenticationStore: AuthenticationStore;
}

interface ServerStates {
  loading: boolean;
}

@inject(Stores.ServerStore, Stores.AuthenticationStore)
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

  public setFieldsValues = (server: any) => {
    //console.log( (new Date(0)).getFullYear() < (new Date(server?.EndDate)).getFullYear());
    this.setState({}, () => {
      this.formRef.current?.setFieldsValue({
        Name: server?.Name,
        IpAddress: server?.IpAddress,
        StartDate:
          this.props.modalType === 'edit' && new Date(0).getFullYear() < new Date(server?.StartDate).getFullYear() ? moment(server?.StartDate) : null,
        EndDate:
          this.props.modalType === 'edit' && new Date(0).getFullYear() < new Date(server?.EndDate).getFullYear() ? moment(server?.EndDate) : null,
        status: server?.Status,
      });
    });
  };

  handleOk = () => {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        if (values.StartDate && values.EndDate) {
          let ds: Date = new Date(values.StartDate.format('YYYY-MM-DD'));
          let de: Date = new Date(values.EndDate.format('YYYY-MM-DD'));
          if (Number(ds.getTime()) >= Number(de.getTime())) {
            alert('End date is invalid!');
            return;
          }
        }
        if(!values.IpAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)){
          alert("Ip Address is invalid!");
          return;
        }
        let id = this.props.authenticationStore.user?.id;
        let valuesUpdate: any = {
          ...values,
          StartDate: values.StartDate ? values.StartDate.format('YYYY-MM-DD') : null,
          EndDate: values.EndDate ? values.EndDate.format('YYYY-MM-DD') : null,
          UpdatedBy: id ? id : null,
          CreatedBy: id ? id : null,
        };

        //
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

    return (
      <>
        <Modal
          visible={visible}
          transitionName="fade"
          title={modalType === 'edit' ? 'Edit Server' : 'Create a new Server'}
          onOk={this.handleOk}
          onCancel={onCancel}
          maskClosable={false}
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
            <Form.Item name="IpAddress" label="Ip Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="StartDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item name="EndDate" label="End Date">
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
            {this.props.modalType === 'edit' ? (
              <Form.Item name="status" label="Status">
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
