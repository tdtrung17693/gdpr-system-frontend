import { Table, Button } from 'antd';
import React from 'react';

const columns = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Status',
    dataIndex: 'requestStatus',
  },
  {
    title: 'Create Date',
    dataIndex: 'createdDate',
  },
  {
    title: 'Update Date',
    dataIndex: 'updatedDate',
  },
  {
    title: 'Server',
    dataIndex: 'serverId',
  },
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    title: 'Request From',
    dataIndex: 'startDate',
  },
  {
    title: 'Request To',
    dataIndex: 'endDate',
  },
  {
    title: '',
    dataIndex: 'button',
  },
];

const data: any = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

export default class ResultTable extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
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
    const { loading, selectedRowKeys }:any = this.state;
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
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}
