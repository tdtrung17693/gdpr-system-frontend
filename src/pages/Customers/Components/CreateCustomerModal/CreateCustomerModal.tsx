import React, { Component } from 'react';
import { Modal, Button, Input, Form, DatePicker } from 'antd';

import axios from 'axios'

export default class CreateCustomerModal extends Component {
  constructor(props: any) {
    super(props);
  }
  //modal
  state = {
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
  //form

  
  FormItem = Form.Item;

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

  //Form Control
  // onNameChange = (value: any) => {
  //   this.setState({name: value})
  // }
  // onBeginDateChange = (value: any) => {
  //   this.setState({contractBeginDate: value})
  // }
  // onEndDateChange = (value: any) => {
  //   this.setState({contractEndDate: value})
  // }
  // onCPChange = (value: any) => {
  //   this.setState({contactPoint: value})
  // }
  // onDescriptionChange = (value: any) => {
  //   this.setState({descritpion: value})
  // }

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
      console.log(response);
      this.setState({
        visible: false,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  render() {
    const { visible, loading } = this.state;
    const { TextArea } = Input;
    //const { Option } = Select;

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
                <DatePicker onChange={value => this.setState({contractBeginDate: value})} name='contractBeginDate' style={{ width: '50%' }} />
                <DatePicker onChange={value => this.setState({contractEndDate: value})} name='contractEndDate' style={{ width: '50%' }} />
              </Input.Group>
            </Form.Item>
            <Form.Item name={['user', 'contactPoint']} label="Contact Point" rules={[{ type: 'email' }, { required: true }]}>
              {/* <Select onChange={this.onCPChange} defaultValue="lucy" style={{ width: '100%' }}>
                <Option value="jack">Jack</Option>
              </Select> */}
              <Input onChange={value => this.setState({contactPoint: value})} defaultValue="lucy" style={{ width: '100%' }}/>
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
