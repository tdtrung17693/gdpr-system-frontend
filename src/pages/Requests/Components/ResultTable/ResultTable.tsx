import { Table, Button, Tag } from 'antd';
import React from 'react';
import { inject, observer } from 'mobx-react';
import RequestStore from '../../../../stores/requestStore';
import Stores from '../../../../stores/storeIdentifier';
import { ColumnProps } from 'antd/lib/table/Column';
import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import moment from 'moment';
import { Link } from 'react-router-dom';
import HistoryLogStore from '../../../../stores/historyLogStore';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import http from '../../../../services/httpService';
import { TablePaginationConfig } from 'antd/lib/table';
//import { TablePaginationConfig } from 'antd/lib/table';

interface IRequests {
  key: string;
  id: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  serverName: string;
  serverIP: string,
  title: string;
  startDate: string;
  endDate: string;
  index: number;
}

interface RequestsProps {
  requestStore: RequestStore;
  historyLogStore: HistoryLogStore;
  handleModalOpen: any;
  filterString: string;
}

interface RequestStates {
  requests: IRequests[];
  selectedRowKeys: any;
  loading: boolean;
  data: any[];
  pageSize: number | undefined;
  page: number | undefined;
  filterBy: string;
}

@inject(Stores.RequestStore, Stores.HistoryLogStore)
@observer
export default class ResultTable extends React.Component<RequestsProps, RequestStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      requests: [],
      selectedRowKeys: [],
      loading: false,
      data: [],
      pageSize: 10,
      page: 1,
      filterBy: '',
    };
    this.handleBulkExportClick = this.handleBulkExportClick.bind(this)
  }

  exportToCSV = (csvData: unknown[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }

  handleBulkExportClick = () => {
    console.log(this.state.selectedRowKeys.toString())
    http.post(`api/Request/bulkExport`, {
      idList: this.state.selectedRowKeys.toString()
    })
      .then((requests) => {
        this.setState({
          data: requests.data,
        });
        
        this.exportToCSV(this.state.data, 'excel')
      })
      .catch((error) => {
        
      });


  }


  handleTableChange = (pagination: TablePaginationConfig) => {
    
    this.setState({pageSize : pagination.pageSize, page: pagination.current, filterBy: this.props.filterString }, async () => {
      this.props.requestStore.pagingObj = {
        pageSize: this.state.pageSize,
        page: this.state.page,
        filterBy: this.props.filterString,
      }
      await this.getAllRequests()
    });

  }

  componentDidMount() {
    this.getAllRequests();
  }

  async getAllRequests() {
    //await this.props.requestStore.getAll();
    const {  pageSize, page, filterBy} = this.state;
    await this.props.requestStore.getRequestPaging({  page, pageSize, filterBy})
  }

  start = async() => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
    
    http.post(`api/Request/exportRequest`, {
      guids: this.state.selectedRowKeys
    })
      .then((requests) => {
        this.setState({
          data: requests.data,
        });
        
        this.exportToCSV(this.state.data, 'excel')
      })
      .catch((error) => {
        
      });
      await this.props.requestStore.getRequestPaging(this.props.requestStore.pagingObj);

  };

  onSelectChange = (selectedRowKeys: any) => {
    
    this.setState({ selectedRowKeys });
  };

  


  
  render() {
    //const sorter = (a: string, b: string) => (a == null && b == null ? (a || '').localeCompare(b || '') : a - b);
    
    this.props.requestStore.requests.items.map(obj=> ({ ...obj, key: obj.Id }))
    const { page, pageSize} = this.state;
    const isEmployee = ({...this.props.requestStore.requests.items[0]}.RoleName == 'Employee')

    const columnsAdmin:ColumnProps<GetRequestOutput>[] = [
      
      {
        title: 'Status',
        dataIndex: 'RequestStatus',
        key: 'RequestStatus',
        filters: [
          {
            text: 'New',
            value: 'New',
          },
          {
            text: 'Open',
            value: 'Open',
          },
          {
            text: 'Closed',
            value: 'Closed',
          }
        ],
        onFilter: (value: any, record: any) => record.RequestStatus.indexOf(value) === 0,
        render: (requestStatus: string) => (
                <Tag style={{ width: '100%', textAlign: 'center' }} color={requestStatus === 'New' ? 'blue' : (requestStatus === 'Open' ? 'green' : 'red')} key={requestStatus}>
                  {requestStatus}
                </Tag>
        ),
      },
      {
        title: 'Created Date',
        dataIndex: 'CreatedAt',
        key: 'createdAt',
        sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.CreatedAt).unix(),
        sortDirections: ['descend', 'ascend'],
        render: (createdAt: Date) => <div>{moment.utc(createdAt, "DD.MM.YY HH:mm:ss").local().format("DD-MM-YYYY HH:mm")}</div>
      },
      {
        title: 'Created By',
        dataIndex: 'CreatedByNameEmail',
        key: 'createdAt',
        //sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Updated Date',
        dataIndex: 'UpdatedAt',
        key: 'updatedAt',
        sorter: (a: any, b: any) => moment(a.UpdatedAt, "DD.MM.YY HH:mm:ss").unix() - moment(b.UpdatedAt, "DD.MM.YY HH:mm:ss").unix(),
        sortDirections: ['descend', 'ascend'],
        render: (updatedAt: Date) => <div>{updatedAt ? moment.utc(updatedAt, "DD.MM.YY HH:mm:ss").local().format("DD-MM-YYYY HH:mm") : ''}</div>
      },
      {
        title: 'Updated By',
        dataIndex: 'UpdatedByNameEmail',
        key: 'updatedAt',
        //sorter: (a: any, b: any) => moment(a.UpdatedAt).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Server',
        dataIndex: 'ServerName',
        key: 'serverId',
      },
      {
        title: 'ServerIP',
        dataIndex: 'ServerIP',
        key: 'serverIP',
      },
      {
        title: 'Title',
        dataIndex: 'Title',
        key: 'title',
      },
      {
        title: 'Request From',
        dataIndex: 'StartDate',
        sorter: (a: any, b: any) => moment(a.StartDate, "DD.MM.YY HH:mm:ss").unix() - moment(b.StartDate, "DD.MM.YY HH:mm:ss").unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Request To',
        dataIndex: 'EndDate',
        key: 'endDate',
        sorter: (a: any, b: any) => moment(a.EndDate, "DD.MM.YY HH:mm:ss").unix() - moment(b.EndDate, "DD.MM.YY HH:mm:ss").unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Action',
        dataIndex: 'Id',
        render: (key: any) => (
        <Link to={`/requests/editrequest/${key}`}>
        <Button type='primary' size ='small' onClick={()=> {this.props.requestStore.currentId=key}}>Detail</Button>
        </Link>)
      },

    ];

    const columnsEmployee:ColumnProps<GetRequestOutput>[] = [
      
      {
        title: 'Status',
        dataIndex: 'RequestStatus',
        key: 'RequestStatus',
        filters: [
          {
            text: 'New',
            value: 'New',
          },
          {
            text: 'Open',
            value: 'Open',
          },
          {
            text: 'Closed',
            value: 'Closed',
          }
        ],
        onFilter: (value: any, record: any) => record.RequestStatus.indexOf(value) === 0,
        render: (requestStatus: string) => (
          <>            
                <Tag color={requestStatus === 'New' ? 'blue' : (requestStatus === 'Open' ? 'green' : 'red')} key={requestStatus}>
                  {requestStatus}
                </Tag>
          </>
        ),
      },
      {
        title: 'Create Date',
        dataIndex: 'CreatedAt',
        key: 'createdAt',
        sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.CreatedAt).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Update Date',
        dataIndex: 'UpdatedAt',
        key: 'updatedAt',
        sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.CreatedAt).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Server',
        dataIndex: 'ServerName',
        key: 'serverId',
      },
      {
        title: 'ServerIP',
        dataIndex: 'ServerIP',
        key: 'serverIP',
      },
      {
        title: 'Title',
        dataIndex: 'Title',
        key: 'title',
      },
      {
        title: 'Request From',
        dataIndex: 'StartDate',
        sorter: (a: any, b: any) => moment(a.StartDate).unix() - moment(b.StartDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Request To',
        dataIndex: 'EndDate',
        key: 'endDate',
        sorter: (a: any, b: any) => moment(a.EndDate).unix() - moment(b.EndDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Action',
        dataIndex: 'Id',
        render: (key: any) => (
        <Link to={`/requests/editrequest/${key}`}>
        <Button type='primary' size ='small' onClick={()=> {this.props.requestStore.currentId=key;}}>Edit</Button>
        </Link>)
      },
    ];


    if (this.props.requestStore.requests.items.length !== 0) {
      this.props.requestStore.requests.items.forEach((requestObject: any, index: number) => {
        this.props.requestStore.handleRequestMember(requestObject.status, index);
      });
    }
    const { loading, selectedRowKeys }: any = this.state;
    const rowSelection = {

      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.handleBulkExportClick} disabled={!hasSelected} loading={loading} >
            Export
          </Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey={record => record.Id}
          rowSelection={rowSelection}
          columns={isEmployee?columnsEmployee:columnsAdmin}
          dataSource={this.props.requestStore.requests.items.length <= 0 ? [] : this.props.requestStore.requests.items}
          bordered = {true}
          onChange = {this.handleTableChange}
          pagination={{ pageSize, total: this.props.requestStore.requests === undefined ? 0 : this.props.requestStore.requests.totalItems, current: page, defaultCurrent: 1 }}
        />
        </div>
      </div>
    );
  }
}
