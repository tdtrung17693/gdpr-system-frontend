import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, TimePicker } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
//import RequestStore from '../../../../stores/RequestStore';
//import { CreateRequestInput } from '../../../../services/request/dto/CreateRequestInput';
//import { UpdateRequestInput } from '../../../../services/request/dto/UpdateRequestInput';
import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { Select } from 'antd';
import RequestStore from '../../../../stores/requestStore';
//import { CreateRequestInput } from '../../../../services/request/dto/CreateRequestInput';
const { Option } = Select;


interface RequestsProps {
  requestStore: RequestStore;
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onSave: (user: GetRequestOutput | null, errors: any) => void;
}

interface RequestStates {
  loading: boolean;
  handleModalOpen: boolean;
}

@inject(Stores.RequestStore)
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
    this.setState({});
  }

  public setFieldsValues = (request: GetRequestOutput) => {
    this.setState({}, () => {
      this.formRef.current?.setFieldsValue({
        UpdatedAt: request?.updatedDate,
        Title: request?.title,
        // startDate: request?.startDate,
        // endDate: request?.endDate,
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
          <Form {...this.layout} name="nest-messages" /*onFinish={this.onFinish}*/ validateMessages={this.validateMessages}>
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
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a server"
                optionFilterProp="children"
                
                filterOption={(input, option) =>
                (option!=undefined) ?  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true
                }
              >
              {
              (this.props.requestStore.serversList != undefined)?
              this.props.requestStore.serversList.map((server: any, i: any) =>
                <Option value={server.id}>{server.name} - {server.ip}</Option>
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
