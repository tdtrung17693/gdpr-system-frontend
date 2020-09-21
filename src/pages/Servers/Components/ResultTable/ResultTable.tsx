import { Table, Button, Tag } from 'antd';
import React from 'react';
//mobx
import { inject, observer } from 'mobx-react';
//import lodash from 'lodash';
import ServerStore from '../../../../stores/serverStore';
import Stores from '../../../../stores/storeIdentifier';
import { BulkServerStatus } from '../../../../services/server/dto/BulkServerStatus';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AuthenticationStore from '../../../../stores/authenticationStore';
import { TablePaginationConfig } from 'antd/lib/table';
import { Key, SorterResult} from 'antd/lib/table/interface';
import { GetServerOutput } from '../../../../services/server/dto/GetServerOutput';
import moment from 'moment';
//import CreateOrEditServerModal from '../CreateOrEditServerModal/CreateOrEditServerModal';

interface ServersProps {
  serverStore: ServerStore;
  createOrUpdateModalOpen: any;
  authenticationStore: AuthenticationStore;
  filterString: string;
}

interface ServerStates {
  selectedRowKeys: any;
  loading: boolean;
  processing: boolean;
  filteredInfo: Record<string, Key[] | null>;
  pageSize: number | undefined;
  page: number | undefined;
  filterBy: string;
  sortedBy: string;
  sortOrder: boolean;
}

@inject(Stores.ServerStore, Stores.AuthenticationStore)
@observer
export default class ResultTable extends React.Component<ServersProps, ServerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      processing: false,

      filteredInfo: {},
      pageSize: 10,
      page: 1,
      filterBy: '',
      sortedBy: 'ServerName',
      sortOrder: true,
    };
    //this.ClickButton = this.ClickButton.bind(this);
  }

  componentDidMount() {
    this.getAllServers();
  }

  getAllServers = async ()=>{
    const {  pageSize, page, filterBy, sortedBy, sortOrder} = this.state;
    await this.props.serverStore.getServerListByPaging({  pageSize, page, filterBy, sortedBy, sortOrder })
  }

  start = async () => {
    this.setState({ processing: true });
    let listId: string[] = [];
    this.state.selectedRowKeys.map((e: string, index: number) => {
      listId.push(this.props.serverStore.servers.items[Number(e)].id);
    });
    console.log(listId);
    let bulkReq: BulkServerStatus = {
      serverIdList: listId,
      status: true,
      updator: this.props.authenticationStore.user?.id ? this.props.authenticationStore.user?.id : '',
    };
    await this.props.serverStore.updateBulkServerStatus(bulkReq);
    await this.props.serverStore.getServerListByPaging(this.props.serverStore.pagingObj); ////////////////////////
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        processing: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys: any) => {
    
    
    this.setState({ selectedRowKeys });
  };


  handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, Key[] | null>, sorter: SorterResult<GetServerOutput> | SorterResult<GetServerOutput>[]) => {
    let sortOrder = true;
    let sortedBy = '';
    //let filterString = "";
    if (!Array.isArray(sorter)) {
      sortOrder = sorter.order === 'ascend' ? true : false;
      if(String(sorter.columnKey) === "ipAddress"){
        sortedBy = "Ip";
      } 
      else if(String(sorter.columnKey) === "cusName"){
        sortedBy = "CustomerName";
      }
      else{
        sortedBy = "ServerName";
      }
    }
    this.setState({pageSize : pagination.pageSize, filteredInfo: filters, page: pagination.current, sortOrder, sortedBy, filterBy: this.props.filterString }, async () => {
      this.props.serverStore.pagingObj = {
        pageSize: this.state.pageSize,
        page: this.state.page,
        filterBy: this.props.filterString,
        sortOrder: this.state.sortOrder,
        sortedBy: this.state.sortedBy
      }
      await this.getAllServers()
    });

  }

  render() {
    let { filteredInfo, processing, selectedRowKeys } = this.state;
    const { page, pageSize} = this.state;
    let { loading } = this.props.serverStore;
    filteredInfo = filteredInfo || {};
    let columns = [
      {
        title: 'Server',
        dataIndex: 'name',
        key: 'name',
        sorter: (a: any, b: any) => a.name.length - b.name.length,
      },
      {
        title: 'Ip Address',
        dataIndex: 'ipAddress',
        key : 'ipAddress',
        sorter: (a: any, b: any) => a?.ipAddress.length - b?.ipAddress.length,
      },
      {
        title: 'StartDate',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (e: Date) => {
          return <div>{e ? moment(e).format("DD/MM/YYYY") : ''}</div>
        }
      },
      {
        title: 'EndDate',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (e: Date) => {
          return <div>{e ? moment(e).format("DD/MM/YYYY") : ''}</div>
        }
      },
      {
        title: 'Owner',
        dataIndex: 'cusName',
        key : 'cusName',
        sorter: (a: any, b: any) => a?.cusName.length - b?.cusName.length,
      },
      {
        title: 'Status',
        key: 'IsActive',
        dataIndex: 'IsActive',
        render: (IsActive: string) => {
          return IsActive === 'active' ? (
            <Tag icon={<CheckCircleOutlined />} style={{ width: '100%', textAlign: 'center' }} color="green"
                 key={IsActive}>
              {IsActive.toLocaleUpperCase()}
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} style={{ width: '100%', textAlign: 'center' }} color="geekblue"
                 key={IsActive}>
              {IsActive.toLocaleUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: '',
        render: (text: string, item: any) => (
          <Button danger onClick={() => this.props.createOrUpdateModalOpen({ id: item.id })}>
            Edit
          </Button>
        ),
      },
    ];

    if (this.props.serverStore.servers.items.length !== 0) {
      //
      this.props.serverStore.servers.items.forEach((serverObject: any, index: number) => {
        this.props.serverStore.handleServerMember(serverObject.status, index);
      });
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={processing}>
            Active/Deactive
          </Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
        <div style={{overflowX: 'auto'}}>
        <Table
          loading={loading}
          rowSelection={rowSelection}
          bordered = {true}
          pagination={{ pageSize, total: this.props.serverStore.servers === undefined ? 0 : this.props.serverStore.servers.totalItems, current: page, defaultCurrent: 1 }}
          columns={columns}
          dataSource={this.props.serverStore.servers.items.length <= 0 ? [] : this.props.serverStore.servers.items}
          onChange = {this.handleTableChange}
        />
        </div>
      </div>
    );
  }
}
