import React, { Component } from 'react';
import { Modal, Button, Card, List, Spin, Radio, Checkbox} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import axios from 'axios'
import Search from 'antd/lib/input/Search';

import '../index.css';
import http from '../../../services/httpService';

export interface IManageServerModalProps {
  modalKey: any;
  visible: boolean;
  onCancel: () => void;
}

const options = [
  { label: 'Show All', value: 'all' },
  { label: 'Owned', value: 'owned' },
  { label: 'Available', value: 'available' },
];

export default class ManageServerModal extends Component<IManageServerModalProps> {
  constructor(props: any) {
    super(props);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }
  //modal
  state = {
    loading: false,
    btnloading: false,
    data: [],
    hasMore: true,
    optionValue: 'all',
    assignedServers: [],
    unassignedServers: [],
  };


  componentDidMount() {
    this.fetchServer();
  }

  //api fetch call 
  fetchServer = async () => {
    await axios.get('http://localhost:5000/api/customer/server/', /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  filterData = async (keyword: any) => {
    await axios.get('http://localhost:5000/api/customer/server/' + keyword, /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getOwnedServer = async (id: any) => {
    await axios.get('http://localhost:5000/api/customer/server/id=' + id, /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getAvailableServer= async () => {
    await axios.get('http://localhost:5000/api/customer/server/available', /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //infinite load on scroller
  handleInfiniteOnLoad = () => {
    // let { data } = this.state;
    // this.setState({
    //   loading: true,
    // });
    // if (data.length > 14) {
    //   //message.warning('Infinite List loaded all');
    //   this.setState({
    //     hasMore: false,
    //     loading: false,
    //   });
    //   return;
    // };
  };

  handleOk = () => {
    this.setState({ btnloading: true });
    setTimeout(() => {
      this.setState({ btnloading: false, visible: false });
    }, 3000);
  };

  // handleCancel = () => {
  //   this.setState({ visible: false });
  // };

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

  //change button group
  onOptionChange = (e: any) => {
    this.setState({
      optionValue: e.target.value,
    });
    if (e.target.value == 'all'){
      this.fetchServer();
    }
    else if (e.target.value == 'owned'){
      this.getOwnedServer(this.props.modalKey.key);
    }
    else{
      this.getAvailableServer();
    }
    
  };

  //Checkbox (de)selected

  handleCheckboxChange = (e: any) => {
    if (e.target.checked){
      if (e.target.value.customerid != this.props.modalKey.key){
        this.setState({assignedServers: this.state.assignedServers.concat(e.target.value.id)});
      }
      else{
        this.setState({unassignedServers: this.state.unassignedServers.filter(id => id != e.target.value.id)});
      }
    }
    else{
      if (e.target.value.customerid != this.props.modalKey.key){
        this.setState({assignedServers: this.state.assignedServers.filter(id => id != e.target.value.id)});
      }
      else{
        this.setState({unassignedServers: this.state.unassignedServers.concat(e.target.value.id)});
      }
    }
    console.log(this.state.assignedServers)
    console.log(this.state.unassignedServers)
  }

  //Search
  handleSearch = (value: any) => {
    this.filterData(value);
  }

  //Submmit
  handleSubmit = () => {
    if (this.state.assignedServers.length != 0){
      http.post('http://localhost:5000/api/customer/server', {
        customerId: this.props.modalKey.key,
        serverIds: this.state.assignedServers,
        action: true,
      })
      this.setState({assignedServers: []});
      this.fetchServer();
    }
    if (this.state.unassignedServers.length != 0){
      http.delete('http://localhost:5000/api/customer/server', {data: {
        customerId: this.props.modalKey.key,
        serverIds: this.state.unassignedServers,
        action: false,
      }})
      this.setState({unassignedServers: []});
    }
    console.log(this.state.assignedServers)
    this.props.onCancel();
  };

  render() {
    const { btnloading, optionValue } = this.state;
    const { visible, onCancel, modalKey } = this.props;

    return (
      <>
        <Modal
          visible={visible}
          key = {modalKey.key}
          title={"Manage Server of: "  + modalKey.name} 
          // onOk={this.handleSubmit}
          onCancel={onCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={btnloading} onClick={this.handleSubmit}>
              Save
            </Button>,
            <Button key="back" onClick={onCancel} >
              Cancel
            </Button>,
          ]}
        >
          <Card title="Search Server">
            <Search
              placeholder="Name or IP Address"
              enterButton="Search"
              size="large"
              onSearch={(value: string) => this.handleSearch(value)}
            />
          </Card>
          <Card title="List Server">
          <Radio.Group
            options={options}
            onChange={this.onOptionChange}
            value={optionValue}
            optionType="button"
            buttonStyle="solid"
          />
          <div className="demo-infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                dataSource={this.state.data}
                renderItem={(item: any) => (
                  <List.Item key={item.id}  style={item.ownedBy.length != 0 ? {backgroundColor: '#ccc'} : {backgroundColor: 'white'}}>
                    <List.Item.Meta 
                      title={
                      <Checkbox defaultChecked={item.customerid == modalKey.key} value={item} onChange={e => this.handleCheckboxChange(e)} disabled={item.ownedBy.length != 0 && item.customerid != modalKey.key}>
                        {item.name}
                      </Checkbox>}
                      description={<><i>{item.ownedBy[0]}</i><p>IP Address: &nbsp; {item.ipAddress}</p></>}
                      
                    />
                  </List.Item>
                )}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
            </div>
          </Card>
        </Modal>
      </>
    );
  }
}
