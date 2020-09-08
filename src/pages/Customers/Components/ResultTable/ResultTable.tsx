import { Table, Button, Badge } from 'antd';
import React from 'react';
import axios from 'axios';
import Search from 'antd/lib/input/Search';
import CreateCustomerModal from '../CreateCustomerModal/CreateCustomerModal';
import ImportButton from '../ImportButton/ImportButton';

// const columns = [
//   {
//     title: 'Customer Name',
//     dataIndex: 'name',
//   },
//   {
//     title: 'Contact Point',
//     dataIndex: 'contactPoint',
//   },
//   {
//     title: 'Contract Begin Date',
//     dataIndex: 'contractBeginDate',
//   },
//   {
//     title: 'Contract End Date',
//     dataIndex: 'contractEndDate',
//   },
//   {
//     title: 'Description',
//     dataIndex: 'description',
//   },
//   {
//     title: 'Machine Owner',
//     dataIndex: 'serverOwned',
//     render: (serverOwned: any) => (
//         <Button type="primary"> Manage &nbsp;&nbsp;
//           <Badge showZero={true} count={serverOwned ? serverOwned : 0} style={{ backgroundColor: '#52c41a' }} />
//         </Button>
//     ),
//   },
//   {
//     title: '',
//     render: (serverOwned: any) => (
//       <Button type="primary" danger> Edit </Button>
//   ),
//   },
// ];

// const data: any = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

// const header = { 
//   "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "*",
//   'Content-Type': 'application/json'
// }

export default class ResultTable extends React.Component {
  constructor(props: any) {
    super(props);
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
  };

  columns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
    },
    {
      title: 'Contact Point',
      dataIndex: 'contactPoint',
    },
    {
      title: 'Contract Begin Date',
      dataIndex: 'contractBeginDate',
    },
    {
      title: 'Contract End Date',
      dataIndex: 'contractEndDate',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Machine Owner',
      dataIndex: 'serverOwned',
      render: (serverOwned: any) => (
          <Button type="primary"> Manage &nbsp;&nbsp;
            <Badge showZero={true} count={serverOwned ? serverOwned : 0} style={{ backgroundColor: '#52c41a' }} />
          </Button>
      ),
    },
    {
      title: '',
      render: (serverOwned: any) => (
        <Button type="primary" danger> Edit </Button>
    ),
    },
  ];

  fetchData = () => {
    axios.get('http://localhost:5000/api/Customer/', /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  filterData = (keyword: any) => {
    axios.get('http://localhost:5000/api/Customer/' + keyword, /*{headers : header}*/)
    .then( (response) =>{
      this.setState({data: response.data});
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleSearch = (keyword: any) => {
    this.filterData(keyword)
  }

  start = () => {
    this.setState({ loading: true, });
    this.fetchData();
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });     
  };

  componentWillMount() {
    this.fetchData();
  }

  render() {
    const { loading, selectedRowKeys }:any = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div className="create-filter">
          <div>
            <CreateCustomerModal />
            <ImportButton />
          </div>
          <Search
            style={{ width: '400px' }}
            placeholder="Search Keyword"
            enterButton="Search"
            size="large"
            onSearch={(value: string) => this.handleSearch(value)}
          />
        </div>
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
              Reload
            </Button>
            
            <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data}></Table>
        </div>
      </div>
    );
  }
}
