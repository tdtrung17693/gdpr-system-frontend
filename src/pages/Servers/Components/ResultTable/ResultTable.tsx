import { Table, Button, Tag } from 'antd';
import React from 'react';
//mobx
import { inject, observer } from 'mobx-react';
import ServerStore from '../../../../stores/serverStore';
import Stores from '../../../../stores/storeIdentifier';
import { BulkServerStatus } from '../../../../services/server/dto/BulkServerStatus';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
//import CreateOrEditServerModal from '../CreateOrEditServerModal/CreateOrEditServerModal';

interface ServersProps {
  serverStore: ServerStore;
  createOrUpdateModalOpen: any;
}

interface ServerStates {
  selectedRowKeys: any;
  loading: boolean;
  filteredInfo:any;
}

@inject(Stores.ServerStore)
@observer
export default class ResultTable extends React.Component<ServersProps, ServerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      filteredInfo: null,
    };
  }

  componentDidMount() {
    this.getAllServers();
  }

  async getAllServers() {
    await this.props.serverStore.getAll();
  }

  start = async () => {
    this.setState({ loading: true });
    let listId: any = [];
    this.state.selectedRowKeys.map((e: string, index: number) => {
      listId.push(this.props.serverStore.servers.items[Number(e)].id);
    });
    let bulkReq: BulkServerStatus = {
      serverIdList: listId,
      status: true,
      updator: 'B461CC44-92A8-4CC4-92AD-8AB884EB1895',
    };
    await this.props.serverStore.updateBulkServerStatus(bulkReq);
    await this.props.serverStore.getAll();
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys: any) => {
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    let columns = [
      {
        title: '#',
        dataIndex: 'Index',
        key: 'index',
      },
      {
        title: 'Server',
        dataIndex: 'name',
        key: 'name',
        sorter: (a: any, b: any) => a.name.length - b.name.length,
        ellipsis: true,
      },
      {
        title: 'Ip Address',
        dataIndex: 'ipAddress',
      },
      {
        title: 'StartDate',
        dataIndex: 'startDate',
      },
      {
        title: 'EndDate',
        dataIndex: 'endDate',
      },
      {
        title: 'Owner',
        dataIndex: 'cusName',
        sorter: (a: any, b: any) => a?.cusName.length - b?.cusName.length,
        ellipsis: true,
      },
      {
        title: 'Status',
        key: 'IsActive',
        dataIndex: 'IsActive',
        render: (IsActive: string) => {
          return IsActive === 'active' ? (
            <Tag icon={<CheckCircleOutlined />} style={{ width: '100%', textAlign: 'center' }} color="green" key={IsActive}>
              {IsActive.toLocaleUpperCase()}
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} style={{ width: '100%', textAlign: 'center' }} color="geekblue" key={IsActive}>
              {IsActive.toLocaleUpperCase()}
            </Tag>
          );
        },
        filters: [
          { text: 'active', value: 'active' },
          { text: 'inactive', value: 'inactive' },
        ],
        filteredValue: filteredInfo.IsActive || null,
        onFilter: (value:any, record:any) => record.IsActive.includes(value),

      },
      {
        title: 'Button',
        render: (text: string, item: any) => (
          <Button shape="round" danger onClick={() => this.props.createOrUpdateModalOpen({ id: item.id })}>
            Edit
          </Button>
        ),
      },
    ];

    if (this.props.serverStore.servers.items.length !== 0) {
      this.props.serverStore.servers.items.forEach((serverObject: any, index: number) => {
        this.props.serverStore.handleServerMember(serverObject.status, index);
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
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Toggle and reload
          </Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.serverStore.servers.items.length <= 0 ? [] : this.props.serverStore.servers.items}
        />
      </div>
    );
  }
}
