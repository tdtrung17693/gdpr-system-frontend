import { Table,  Tag, Button } from 'antd';
import React, { Component } from 'react';
import axios from 'axios';
// import Button from 'react-bootstrap/Button';


export default class ResultTable extends Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      index: '',
      datas: [],
      //for checkbox
      selectedRowKeys: [], 
      loading: false,
    }
  } 

  getRequestsData() {
    const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;
    axios
        .get(`${url}api/Request`)
        .then( requests => {
          this.setState({
            datas: requests.data,
          });
        })
        .catch((error) => {
            console.log(error)
        })

  }

  componentDidMount(){
    this.getRequestsData();
    
  }
  
  //for checkbox
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };

  render() {

    const columns = [
      {
        title: 'ID',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Status',
        dataIndex: 'requestStatus',
        key: 'requestStatus',
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
        dataIndex: 'createdDate',
        key: 'createdDate',
      },
      {
        title: 'Update Date',
        dataIndex: 'updatedDate',
        key: 'updatedDate',
      },
      {
        title: 'Server',
        dataIndex: 'serverId',
        key: 'serverId',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Request From',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: 'Request To',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: 'Action',
        dataIndex: 'button',
        key: 'button',
        render: () => <Button type="primary" size="small">Edit</Button>
      },
    ];

    const dataSrc = this.state.datas.map((data: { requestStatus: any; createdAt: any; updatedAt: any; serverId: any; title: any; startDate: any; endDate: any; },i: any) =>
      ({
        key: i,
        requestStatus: data.requestStatus,
        createdDate: data.createdAt,
        updatedDate: data.updatedAt,
        serverId: data.serverId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate
      })
    )

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" size="small" >
            Accept/Decline
          </Button>
          <span style={{ marginLeft: 8 }}></span>
        </div>
        <Table rowSelection={rowSelection} dataSource={dataSrc} columns={columns} />
      </div>
    );
  }
}
