import React, { Component } from 'react';
import { Modal, Button, Card, List, Spin, Radio, Checkbox, message} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

//import axios from 'axios'
import Search from 'antd/lib/input/Search';

import '../index.css';
import http from '../../../services/httpService';

//import Customer from '../index';

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
    this.getAllServer();
  }

  //api fetch call 
  getAllServer = async () => {
    let response = await http.get('api/customer/server/');
    this.setState({data: response.data});
  }

  filterData = async (keyword: any) => {
    let response = await http.get('api/customer/server/' + keyword)
    this.setState({data: response.data});
  }

  getOwnedServer = async (id: any) => {
    let response = await http.get('api/customer/server/id=' + id)
    this.setState({data: response.data});
  }

  getAvailableServer= async () => {
    let response = await http.get('api/customer/server/available')
    this.setState({data: response.data});
  }

  //infinite load on scroller
  handleInfiniteOnLoad = () => {

  };

  handleOk = () => {
    this.setState({ btnloading: true });
    setTimeout(() => {
      this.setState({ btnloading: false, visible: false });
    }, 3000);
  };

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
      this.getAllServer();
    }
    else if (e.target.value == 'owned'){
      //
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
    // 
    // 
  }

  //Search
  handleSearch = (value: any) => {
    this.filterData(value);
  }

  //Submmit
  handleSubmit = async () => {
    if (this.state.assignedServers.length != 0){
      await http.post('api/customer/server', {
        customerId: this.props.modalKey.key,
        serverIds: this.state.assignedServers,
        action: true,
      }).then((response) => {
        message.success(`Successfully update servers of ${this.props.modalKey.name}`)
      }).catch((error) => {
        message.error(`Update servers of ${this.props.modalKey.name} failed`)
      });
      this.setState({assignedServers: []});
    }
    if (this.state.unassignedServers.length != 0){
      await http.delete('api/customer/server', {data: {
        customerId: this.props.modalKey.key,
        serverIds: this.state.unassignedServers,
        action: false,
      }}).then((response) => {
        message.success(`Successfully update servers of ${this.props.modalKey.name}`)
      }).catch((error) => {
        message.error(`Update servers of ${this.props.modalKey.name} failed`)
      });
      this.setState({unassignedServers: []});
    }
    
    this.handleCancel();
  };

  handleCancel = () => {
    this.props.onCancel();
    this.setState({optionValue: 'all'}); 
    this.getAllServer(); 
    //
  }

  render() {
    const { btnloading, optionValue } = this.state;
    const { visible, modalKey } = this.props;

    return (
      <>
        <Modal
          visible={visible}
          key = {modalKey.key}
          maskClosable = {false}
          title={"Manage Server of: "  + modalKey.name}
          transitionName='fade'
          onCancel={() => {this.handleCancel()}}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={btnloading} onClick={this.handleSubmit}>
              Save
            </Button>,
            <Button key="back" onClick={() => this.handleCancel()} >
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
                      <Checkbox defaultChecked={item.customerid[0] == modalKey.key} value={item} onChange={e => this.handleCheckboxChange(e)} 
                      disabled={item.ownedBy.length != 0 && item.customerid[0] != modalKey.key}>
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
