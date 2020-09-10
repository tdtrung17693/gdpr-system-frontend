import React from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Badge, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import '../Customers/index.css';
import axios from 'axios';

//import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton';
import CreateCustomerModal from './Components/CreateCustomerModal';
import ManageServerModal from './Components/ManageServerModal';

import { EditOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Panel } = Collapse;



const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData: any, fileName: any) => {
      const csvDataRequest = csvData.map((e: any) => e.request[0]);
      
      const ws = XLSX.utils.json_to_sheet((csvDataRequest));
      console.log(ws);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(data, fileName + fileExtension);
}


export default class Customers extends React.Component {
  modalRef = React.createRef<ManageServerModal>();
  state = {
    fromDate: Date(),
    toDate: Date(),
    guids: [],
    //table
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    //server manage modal
    modalVisible: false,
    modalKey: '',
  };

  // resultTable: ResultTable = new ResultTable(this.props);
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
      render: (serverOwned: any, key: any) => (
          <Button onClick={() => this.setState({modalVisible: true, modalKey: key.key})} type="primary"> Manage &nbsp;&nbsp;
            <Badge showZero={true} count={serverOwned ? serverOwned : 0} style={{ backgroundColor: '#52c41a' }} />
          </Button>
      ),
    },
    {
      title: '',
      render: () => (
        <Button type="primary"  danger > Edit </Button>
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
  // handleSearch = (keyword: any) => {
  //   this.resultTable.fetchData(keyword)
  // }

  handleExport = (e: any) => {
    axios.post('http://localhost:5000/api/Customer/export-csv', {
    fromDate: this.state.fromDate,
    toDate: this.state.toDate,
    guids: this.state.selectedRowKeys,
  })
    .then((response) =>{
      console.log(response.data.responsedRequest);
      exportToCSV(response.data.responsedRequest, 'RequestList');
    })
    .catch(function (error) {
      console.log(error);
    });
    //console.log(e.target.value);
  }

  render(){ 
    const { loading, selectedRowKeys }:any = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
    <div>
      <h2>Customers Management</h2>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Export Requests By Customers" key='0'>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={12}>
                <Card hoverable={true} title="FromDate:" bordered={false}>
                  <Input.Group compact>
                    <EditOutlined />
                    <DatePicker onChange={value => this.setState({fromDate: value})} style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
              <Col span={12}>
                <Card hoverable={true} title="ToDate:" bordered={false}>
                  <Input.Group compact>
                    <EditOutlined />
                    <DatePicker onChange={value => this.setState({toDate: value})} style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
            </Row>
          </div>
          <Button type="primary" onClick={this.handleExport}>Process Data</Button>
        </Panel>
      </Collapse>
      <div>
        <div className="create-filter">
          <div>
            <CreateCustomerModal />
            <ManageServerModal
              ref={this.modalRef}
              visible={this.state.modalVisible}
              modalKey={this.state.modalKey}
              onCancel={() =>
                this.setState({
                  modalVisible: false,
                  modalKey: '',
                })
              }
              {...this.props}
            />
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
    </div>
  );
  }
}
