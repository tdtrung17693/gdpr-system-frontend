import React, { Component } from 'react';
import { Modal, Button, Card, List, Spin, Radio, Checkbox} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import axios from 'axios'
import Search from 'antd/lib/input/Search';

import '../index.css';

export interface IManageServerModalProps {
  visible: boolean;
  onCancel: () => void;
}

const options = [
  { label: 'Show All', value: 'all' },
  { label: 'Owned', value: 'owned' },
  { label: 'Available', value: 'available' },
];

export default class ManageServerModal extends Component<IManageServerModalProps> {
  //modal
  state = {
    loading: false,
    visible: false,
    data: [],
    //loading: false,
    hasMore: true,
    optionValue: 'all',
  };


  componentDidMount() {
    this.fetchServer();
  }

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

  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      //message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    };
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
    if (e.target.value == 'all'){
      this.fetchServer();
    }
    else if (e.target.value == 'owned'){
      console.log(e.target.value)
    }
    else{
      this.getAvailableServer();
    }
    this.setState({
      optionValue: e.target.value,
    });
  };

  //Search
  handleSearch = (value: any) => {
    this.filterData(value);
  }

  //Submmit
  handleSubmit = () => {
      this.setState({
        visible: false,
      });
  };

  render() {
    const { loading, optionValue } = this.state;
    const { visible, onCancel } = this.props;
    //const { Option } = Select;

    return (
      <>
        <Modal
          visible={visible}
          title="Manage Server of:"
          // onOk={this.handleSubmit}
          onCancel={onCancel}
          footer={[
            <Button key="submit" htmlType="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
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
                      title={<Checkbox disabled={item.ownedBy.length != 0}>{item.name}</Checkbox>}
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
