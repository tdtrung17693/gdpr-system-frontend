import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Select } from 'antd';

import axios from 'axios'
import http from '../../../services/httpService';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import moment from 'moment';
//import moment from 'moment';

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
    contractBeginDate: null,
    contractEndDate: null,
    contactPoint: '',
    description: null,
    statusText: 'Active',
  };

  componentWillMount() {
    this.fetchData();
  }

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

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  triggerStatus = () => {
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
    console.log(this.state.customerName)
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
  handleSubmit = async (e: any) => {
    e.preventDefault();
    if (this.props.modalKey.name == undefined){
      await http.post('api/Customer',{
        contractBeginDate:  this.formRef.current?.getFieldValue('contractBeginDate'),
        contractEndDate: this.formRef.current?.getFieldValue('contractEndDate'),
        contactPoint: this.formRef.current?.getFieldValue('contactPoint'),
        description: this.formRef.current?.getFieldValue('description'),
        status: this.formRef.current?.getFieldValue('status'),
        customerName: this.formRef.current?.getFieldValue('name'),
      })
        .then((response) =>{
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.handleCancel();
    }
    else{
      await http.put('api/Customer',{
        contractBeginDate:  this.formRef.current?.getFieldValue('contractBeginDate'),
        contractEndDate: this.formRef.current?.getFieldValue('contractEndDate'),
        contactPoint: this.formRef.current?.getFieldValue('contactPoint'),
        description: this.formRef.current?.getFieldValue('description'),
        status: this.formRef.current?.getFieldValue('status'),
        customerName: this.formRef.current?.getFieldValue('name'),
        id: this.props.modalKey.key
      })
        .then((response) =>{
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      
      this.handleCancel();
    }
    console.log(e);
  };

  handleCancel = () => {
    this.props.onCancel();
    this.formRef.current?.resetFields();
    this.triggerStatus();
  }

  render() {
    const { loading, data } = this.state;
    const { visible, modalKey } = this.props;
    
    return (
      <>
        <Modal
          visible={visible}
          title={modalKey.name == undefined? "Create new Customer" : "Edit Customer: " + modalKey.name}
          key = {modalKey.key}
          // onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={(e:any) => this.handleSubmit(e)}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form ref={this.formRef} layout="vertical" name="nest-messages" validateMessages={this.validateMessages}>
            <Form.Item initialValue={modalKey.name} name='name' label="Customer Name" rules={[{ required: true }]}>
              <Input onChange={event => this.setState({ customerName: event.target.value})}/>
            </Form.Item>
            <Input.Group compact>
                <Form.Item initialValue = {modalKey.key != undefined ? moment(modalKey.contractBeginDate) : null} name='contractBeginDate' 
                label="Contract Begin Date" rules={[{ required: true }]}  style={{ width: '50%' }}>
                    <DatePicker onChange={value => this.setState({contractBeginDate: value})}  style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item initialValue = {modalKey.key != undefined ? moment(modalKey.contractEndDate) : null} name='contractEndDate' 
                label="Contract End Date" style={{ width: '50%' }}>
                    <DatePicker onChange={value => this.setState({contractEndDate: value})}  style={{ width: '100%' }} />
                </Form.Item>
            </Input.Group>
            <Form.Item initialValue={modalKey.contactPointID} name='contactPoint' label="Contact Point" rules={[{ required: true, message: L('ThisFieldIsRequired') }]}>
              <Select onChange={value => this.setState({contactPoint: value})} style={{ width: '100%' }}>
                {data.map((d: any) => (
                  <Option key={d.id} value={d.id}>{d.email}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item initialValue={modalKey.description} name='description' label="Description">
              <Input defaultValue={modalKey.description} onChange={e => {console.log(e.target.value); this.setState({description: e.target.value})}}  />
            </Form.Item>
            <Form.Item initialValue={modalKey.status} name='status' label="Status">
              <Button onClick={this.triggerStatus}>{this.state.status ? 'Active' : 'Inactive'}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
