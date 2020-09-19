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
}

interface RequestStates {
  requests: IRequests[];
  selectedRowKeys: any;
  loading: boolean;
  data: any[];
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
    };
  }

  exportToCSV = (csvData: unknown[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }

  handleExportClick = () => {
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


  }

  componentDidMount() {
    this.getAllRequests();
  }

  async getAllRequests() {
    await this.props.requestStore.getAll();
  }

  start = () => {
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

  };

  onSelectChange = (selectedRowKeys: any) => {
    
    this.setState({ selectedRowKeys });
  };

  
  render() {
    //const sorter = (a: string, b: string) => (a == null && b == null ? (a || '').localeCompare(b || '') : a - b);
    this.props.requestStore.requests.items.map(obj=> ({ ...obj, key: obj.Id }))
    
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
                <Tag color={requestStatus === 'New' ? 'blue' : (requestStatus === 'Open' ? 'green' : 'red')} key={requestStatus}>
                  {requestStatus}
                </Tag>
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
        title: 'Create By',
        dataIndex: 'CreatedByNameEmail',
        key: 'createdAt',
        //sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Update Date',
        dataIndex: 'UpdatedAt',
        key: 'updatedAt',
        sorter: (a: any, b: any) => moment(a.UpdatedAt).unix() - moment(b.UpdatedAt).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Update By',
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
        title: 'Create By',
        dataIndex: 'CreatedByNameEmail',
        key: 'createdAt',
        //sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.contractBeginDate).unix(),
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
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading} >
            Reload
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
        />
        </div>
      </div>
    );
  }
}
