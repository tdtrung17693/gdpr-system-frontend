import React from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Search from 'antd/lib/input/Search';
import { inject, observer } from 'mobx-react';
import { EditOutlined } from '@ant-design/icons';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Badge, Table, message } from 'antd';

import '../Customers/index.css';
import http from '../../services/httpService';
import Stores from '../../stores/storeIdentifier';
import ImportButton from './Components/ImportButton';
import CustomerStore from '../../stores/customerStore';
import ManageServerModal from './Components/ManageServerModal';
import CreateCustomerModal from './Components/CreateCustomerModal';

const { Panel } = Collapse;

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData: any, fileName: any) => {
  const csvDataRequest = csvData.map((e: any) => e.request[0]);

  const ws = XLSX.utils.json_to_sheet((csvDataRequest));
  const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

interface ICustomerProps {
  customerStore: CustomerStore
}

@inject(Stores.CustomerStore)
@observer
export default class Customers extends React.Component<ICustomerProps> {
  modalRef = React.createRef<ManageServerModal>();
  createModalRef = React.createRef<CreateCustomerModal>();

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
    modalKey: [],
    createModalVisible: false,
    createModalKey: {},
    processing: false,
  };

  columns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
      sortDirection: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Contact Point',
      dataIndex: 'contactPoint',
    },
    {
      title: 'Contract Begin Date',
      dataIndex: 'contractBeginDate',
      sortDirection: ['descend', 'ascend'],
      sorter: (a: any, b: any) => moment(a.contractBeginDate).unix() - moment(b.contractBeginDate).unix(),
      render: (contractBeginDate: any) => (<>{contractBeginDate != null && moment(contractBeginDate).format('DD/MM/YYYY').toString()}</>),
    },
    {
      title: 'Contract End Date',
      dataIndex: 'contractEndDate',
      sortDirection: ['descend', 'ascend'],
      sorter: (a: any, b: any) => moment(a.contractEndDate).unix() - moment(b.contractEndDate).unix(),
      render: (contractEndDate: any) => (<>{contractEndDate != null && moment.utc(contractEndDate).format('DD/MM/YYYY').toString()}</>),
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Machine Owner',
      dataIndex: 'serverOwned',
      sortDirection: ['descend', 'ascend'],
      sorter: (a: any, b: any) => a.serverOwned - b.serverOwned,
      render: (serverOwned: any, key: any) => (
        <Button type="primary" onClick={() => {
          this.setState({ modalVisible: true, modalKey: key });
        }}> Manage &nbsp;&nbsp;
          <Badge showZero={true} count={serverOwned ? serverOwned : 0} style={{ backgroundColor: '#52c41a' }} />
        </Button>
      ),
    },
    {
      title: '',
      render: (key: any) => (
        <Button onClick={() => {
          this.setState({ createModalVisible: true, createModalKey: key });
        }} danger> Edit </Button>
      ),
    },
  ];

  fetchData = async () => {
    await this.props.customerStore.getCustomerList({
      keyword: '',
      page: 1,
      pageSize: 10,
    });
  };

  filterData = async (keyword: any) => {
    await this.props.customerStore.getFilteredCustomerList(keyword);
  };

  handleSearch = (keyword: any) => {
    this.filterData(keyword);
  };

  start = () => {
    this.setState({ processing: true }, async () => {
      await this.fetchData();
      this.setState({
        selectedRowKeys: [],
        processing: false,
      });
    });
  };

  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });     
  };

  componentDidMount() {
    this.fetchData();
  }

  handleExport = async (e: any) => {
    let response = await http.post('api/Customer/export-csv', {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      guids: this.state.selectedRowKeys,
    });
    try {
      exportToCSV(response.data.responsedRequest, 'RequestList');
    } catch (e) {
      message.error('Cannot export data');
    }
  };

  render() {
    const { processing, selectedRowKeys }: any = this.state;
    const { loading, customers } = this.props.customerStore;
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
                      <DatePicker onChange={(value: any) => this.setState({ fromDate: value })}
                                  style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable={true} title="ToDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker onChange={(value: any) => this.setState({ toDate: value })}
                                  style={{ width: '100%' }} />
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
              <Button type="primary" onClick={() => {
                this.setState({ createModalVisible: true, createModalKey: {} });
              }}>
                Create new Customer
              </Button>
              <CreateCustomerModal
                ref={this.createModalRef}
                visible={this.state.createModalVisible}
                modalKey={this.state.createModalKey}
                onCancel={async () => {
                  {
                    this.setState({
                      createModalVisible: false,
                      createModalKey: {},
                    });
                    await this.fetchData();
                  }
                }
                }
                {...this.props}
              />
              <ManageServerModal
                ref={this.modalRef}
                visible={this.state.modalVisible}
                modalKey={this.state.modalKey}
                onCancel={() => {
                  this.setState({
                    modalVisible: false,
                    modalKey: {},
                  }, async () => await this.fetchData());
                }
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
              <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={processing}>
                Reload
              </Button>

              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <Table loading={loading} rowSelection={rowSelection} columns={this.columns} dataSource={customers} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
