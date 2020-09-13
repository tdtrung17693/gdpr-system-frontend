import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Select } from 'antd';

import axios from 'axios'
import http from '../../../services/httpService';
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

export interface ICreateCustomerProps {
  modalKey: any;
  visible: boolean;
  onCancel: () => void;
}


export default class CreateCustomerModal extends Component<ICreateCustomerProps> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
    data: [],
    loading: false,
    visible: false,
    status: true,
    customerName: '',
    contractBeginDate: Date() || null,
    contractEndDate: Date() || null,
    contactPoint: '',
    description: '',
    statusText: 'Active',
  };

  componentDidMount() {
    this.fetchData();
  }

  // public setFieldsValues = (server: any) => {
  //   this.setState({}, () => {
  //     this.formRef.current?.setFieldsValue({
  //       name: server?.Name,
  //       description: server?.description,
  //       contractBeginDate: this.props.modalType === 'edit' ? moment(server?.StartDate): '', 
  //       contractEndDate: this.props.modalType === 'edit' ? moment(server?.EndDate): '',
  //       status: server?.Status,
  //     });
  //   });
  // };
  
  fetchData = async () => {
    await axios.get('http://localhost:5000/api/customer/contact-point', /*{headers : header}*/)
    .then( (response) =>{
      //console.log(response.data);
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

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
    if (this.state.status){
      this.setState({
        status: false,
        statusText: 'Inactive',
      })
    }
    else{
      this.setState({
        status: true,
        statusText: 'Active',
      })
    };
  }
  
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

  //Submmit
  handleSubmit = async () => {
    if (this.props.modalKey.name == undefined){
      await http.post('http://localhost:5000/api/Customer',{
        contractBeginDate: this.state.contractBeginDate,
        contractEndDate: this.state.contractEndDate,
        contactPoint: this.state.contactPoint,
        description: this.state.description,
        status: this.state.status,
        customerName: this.state.customerName
      })
        .then((response) =>{
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.props.onCancel()
    }
    else{
      await http.put('http://localhost:5000/api/Customer',{
        contractBeginDate: this.state.contractBeginDate,
        contractEndDate: this.state.contractEndDate,
        description: this.state.description,
        contactPoint: this.state.contactPoint,
        status: this.state.status,
        customerName: this.state.customerName,
        id: this.props.modalKey.key
      })
        .then((response) =>{
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.props.onCancel()
    }
  };

  render() {
    const { loading, data } = this.state;
    const { visible, onCancel, modalKey } = this.props;
    //const { TextArea } = Input;

    return (
      <>
        <Modal
          visible={visible}
          title={modalKey.name == undefined? "Create new Customer" : "Edit Customer: " + modalKey.name}
          key = {modalKey.key}
          // onOk={this.handleSubmit}
          onCancel={onCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              Save
            </Button>,
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form {...this.layout} layout="vertical" name="nest-messages" validateMessages={this.validateMessages}>
            <Form.Item name='name' label="Customer Name" rules={[{ required: true }]}>
              <Input onChange={event => this.setState({ customerName: event.target.value})}/>
            </Form.Item>
            <Form.Item label="Date Range" rules={[{ required: true }]}>
              <Input.Group compact>
                <DatePicker  onChange={value => this.setState({contractBeginDate: value})} name='contractBeginDate' showTime={true} style={{ width: '50%' }} />
                <DatePicker  onChange={value => this.setState({contractEndDate: value})} name='contractEndDate' showTime={true} style={{ width: '50%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name='contactPoint' initialValue={modalKey.contactPoint} label="Contact Point" rules={[{ required: true }]}>
              <Select onChange={value => this.setState({contactPoint: value})} defaultValue="Select a contact point" style={{ width: '100%' }}>
                {data.map((d: any) => (
                  <Option key={d.id} value={d.id}>{d.email}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='description' initialValue={modalKey.description} label="Description">
              <Input onChange={e => {console.log(e.target.value); this.setState({description: e.target.value})}}  />
            </Form.Item>
            <Form.Item name='status' label="Status">
              <Button defaultValue='Active' onClick={this.triggerStatus}>{this.state.statusText}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
