import { Table, Button } from 'antd';
import React from 'react';

const columns = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Server',
    dataIndex: 'server',
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
    dataIndex: 'createBy',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: '',
    dataIndex: 'button',
  },
];


interface IServers {
  id: string;
  name: string;
  ipAddress: string;
  createBy: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ServersProps {
  data: IServers[];
}

interface ServerStates {
  servers: IServers[];
  selectedRowKeys: any;
  loading: boolean;
}

const data: IServers[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    id: ""+i,
    name: `Edward King ${i}`,
    createBy: ""+32+i,
    ipAddress: `London, Park Lane no. ${i}`,
    startDate: "string",
    endDate: "string",
    status: "string",
  });
}

export default class ResultTable extends React.Component<ServersProps, ServerStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      servers: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ servers: this.props.data });
  }

  componentDidUpdate() {
    if (this.props.data.length !== this.state.servers.length) {
      this.setState({ servers: this.props.data });
      console.log(this.state.servers);
    }
  }

  start = () => {
    this.setState({ loading: true });
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

  render() {
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
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.servers} />
      </div>
    );
  }
}
