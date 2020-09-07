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

export default class ResultTable extends React.Component {
  
  render() {
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" >
            Accept/Decline
          </Button>
          <span style={{ marginLeft: 8 }}></span>
        </div>
        <Table columns={columns} />
      </div>
    );
  }
}
