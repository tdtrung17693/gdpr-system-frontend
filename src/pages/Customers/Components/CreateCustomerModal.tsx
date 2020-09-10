import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker, Select } from 'antd';

import axios from 'axios'

const { Option } = Select;

export default class CreateCustomerModal extends Component {
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
    contractBeginDate: Date(),
    contractEndDate: Date(),
    contactPoint: '',
    description: '' ,
    statusText: 'Active',
  };

  componentDidMount() {
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
  handleSubmit = () => {
    axios.post('http://localhost:5000/api/Customer',{
    contractBeginDate: this.state.contractBeginDate,
    contractEndDate: this.state.contractEndDate,
    description: this.state.description,
    status: this.state.status,
    customerName: this.state.customerName
  })
    .then((response) =>{
      //console.log(response);
      this.setState({
        visible: false,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  render() {
    const { visible, loading, data } = this.state;
    const { TextArea } = Input;

    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          Create new Customer
        </Button>
        <Modal
          visible={visible}
          title="Create new Customer"
          // onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Form {...this.layout} layout="vertical" name="nest-messages" onFinish={this.handleSubmit} validateMessages={this.validateMessages}>
            <Form.Item name={['user', 'name']} label="Customer Name" rules={[{ required: true }]}>
              <Input onChange={event => this.setState({ customerName: event.target.value})}/>
            </Form.Item>
            <Form.Item label="Date Range" rules={[{ required: true }]}>
              <Input.Group compact>
                <DatePicker onChange={value => this.setState({contractBeginDate: value})} name='contractBeginDate' showTime={true} style={{ width: '50%' }} />
                <DatePicker onChange={value => this.setState({contractEndDate: value})} name='contractEndDate' showTime={true} style={{ width: '50%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name={['user', 'contactPoint']} label="Contact Point" rules={[{ required: true }]}>
              <Select onChange={value => this.setState({contactPoint: value})} defaultValue="Select contact point" style={{ width: '100%' }}>
                {data.map((d: any) => (
                  <Option key={d.id} value={d.id}>{d.email}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name={['user', 'description']} label="Description" rules={[{ required: true }]}>
              <TextArea onChange={value => this.setState({descritpion: value})} rows={4} />
            </Form.Item>
            <Form.Item name={['user', 'status']} label="Status">
              <Button defaultValue='Active' onClick={this.triggerStatus}>{this.state.statusText}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
