import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, message } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { Select } from 'antd';
import RequestStore from '../../../../stores/requestStore';
import { CreateRequestInput } from '../../../../services/request/dto/createRequestInput';
import AuthenticationStore from '../../../../stores/authenticationStore';

const { Option } = Select;


interface RequestsProps {
  requestStore: RequestStore;
  authenticationStore: AuthenticationStore;
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onSave: (user: CreateRequestInput | null, errors: any) => void;
}

interface RequestStates {
  loading: boolean;
  handleModalOpen: boolean;
}

@inject(Stores.RequestStore, Stores.AuthenticationStore)
@observer
export default class HandleModal extends Component<RequestsProps, RequestStates> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    loading: false,
    handleModalOpen: false,
  };

  componentDidMount() {
    this.getServer();
    this.setState({});
  }

  async getServer() {
    await this.props.requestStore.getServerList();
  }

  public setFieldsValues = (request: GetRequestOutput) => {
    this.setState({}, () => {
      this.formRef.current?.setFieldsValue({
        UpdatedAt: request?.updatedDate,
        Title: request?.title,
        startDate: request?.startDate,
        endDate: request?.endDate,
        Status: request?.status,
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

          createdBy: this.props.authenticationStore.user?.id,  
          title: values.title,
          startDate: values.startDate.format('YYYY-MM-DD HH:mm:ss'),
          endDate: values.endDate.format('YYYY-MM-DD HH:mm:ss'),
          serverId: values.serverId,
          description: (values.description) ? values.description : ''
        };
        console.log(valuesUpdate);
        if (this.props.modalType=='update'){
          if (valuesUpdate.startDate > valuesUpdate.endDate) {message.info("Update fail. StartDate must before EndDate")}
          else{
          this.props.onSave(valuesUpdate, null);
          message.info("Update successfully");
          }
        }
        else{
          if (valuesUpdate.startDate > valuesUpdate.endDate) {message.info("Create fail. StartDate must before EndDate")}
          else{
          this.props.onSave(valuesUpdate, null);
          message.info("Create successfully");
          }
        }
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
    const { visible, onCancel} = this.props;
    return (
      <>
        <Modal
          visible={visible}
          title={'Create a new Request'}
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
          <Form {...this.layout} ref= {this.formRef} name="nest-messages" /*onFinish={this.onFinish}*/ validateMessages={this.validateMessages}>
            <Form.Item name={'title'} label="Title" rules={(this.props.modalType=='create')?[{ required: true }]:[]} >
              <Input />
            </Form.Item>
            <Form.Item name={'startDate'} label="From Date" rules={(this.props.modalType=='create')?[{ required: true }]:[]} >
            <DatePicker style={{ width: 315}} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item name={'endDate'} label="To Date"  >
            <DatePicker style={{ width: 315}} showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item name={'serverId'} label="Server" rules={(this.props.modalType=='create')?[{ required: true }]:[]} >
            <Select
                showSearch
                style={{ width: 315 }}
                placeholder="Select a server"
                optionFilterProp="children"
                
                // filterOption={(input, option) =>
                // (option!=undefined) ?  option.indexOf(input.toLowerCase()) >= 0 : true
                // }
                filterOption = {true}
              >
              {
              (this.props.requestStore.serversList != undefined)?
              this.props.requestStore.serversList.map((server: any, i: any) =>
                <Option key={server.id} value={server.id}>{server.name} - {server.ipAddress}</Option>
              ): null}
            </Select>
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
