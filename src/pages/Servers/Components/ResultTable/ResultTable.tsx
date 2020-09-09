import { Table, Button, Switch } from 'antd';
import React from 'react';
//mobx
import { inject, observer } from 'mobx-react';
import ServerStore from '../../../../stores/serverStore';
import Stores from '../../../../stores/storeIdentifier';
import CreateOrEditServerModal from '../CreateOrEditServerModal/CreateOrEditServerModal';

const columns = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Server',
    dataIndex: 'name',
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
    dataIndex: 'createdBy',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Button',
    dataIndex: 'editButton',
  },
];

interface IServers {
  key: string;
  id: string;
  name: string;
  ipAddress: string;
  createBy: string;
  startDate: string;
  endDate: string;
  status: any;
  editButton: any;
  index: number;
  isActive: boolean;
}

interface ServersProps {
  serverStore: ServerStore;
}

interface ServerStates {
  servers: IServers[];
  selectedRowKeys: any;
  loading: boolean;
}

@inject(Stores.ServerStore)
@observer
export default class ResultTable extends React.Component<ServersProps, ServerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      servers: [],
      selectedRowKeys: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getAllServers();
  }

  async getAllServers() {
    console.log(this.props.serverStore.servers.items);
    await this.props.serverStore.getAll();
  }

  start = () => {
    this.setState({ loading: true });
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

  render() {
    if (this.props.serverStore.servers.items.length !== 0) {
      this.props.serverStore.servers.items.forEach((serverObject: any, index: number) => {
        serverObject.key = '' + index;
        serverObject.index = index + 1;
        serverObject.isActive = serverObject.status;
        serverObject.status = serverObject.status ? <Switch disabled={true} defaultChecked /> : <Switch disabled={true} />;
        serverObject.editButton = (
          <CreateOrEditServerModal key={serverObject.name} serverData={serverObject} isCreate={false} isEdit serverStore={this.props.serverStore} />
        );
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
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.props.serverStore.servers.items} />
      </div>
    );
  }
}

// let modifiedServer: IServers = {
//   key: '' + index,
//   id: serverObject.id,
//   name: serverObject.name,
//   ipAddress: serverObject.ipAddress,
//   createBy: serverObject.createdBy,
//   startDate: serverObject.startDate,
//   endDate: serverObject.endDate,
//   status: serverObject.status ? <Switch disabled={true} defaultChecked /> : <Switch disabled={true} />,
//   editButton: (
//     <CreateOrEditServerModal key={serverObject.name} serverData={serverObject} isCreate={false} isEdit serverStore={this.props.serverStore} />
//   ),
//   index: index + 1,
//   isActive: serverObject.status,
// };
//modifiedServerList.push(modifiedServer);
