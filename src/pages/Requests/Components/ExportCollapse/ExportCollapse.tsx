import React from 'react';
import { Collapse, Card, Col, Row, Input, DatePicker } from 'antd';
import { Component } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ExportCSVButton } from '../ExportCSVButton/ExportCSVButton';
import axios from 'axios';

const { Panel } = Collapse;

export default class ExportCollapse extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      index: '',
      datas: [],
      fileName: 'excel'
    };
  }

  getRequestsData() {
    const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;
    axios
      .get(`${url}api/Request`)
      .then((requests) => {
        this.setState({
          datas: requests.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getRequestsData();
  }

  render() {
    return (
      <div>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Export Requests" key="0">
            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={6}>
                  <Card hoverable={true} title="FromDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable={true} title="ToDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
              </Row>
            </div>
            <ExportCSVButton csvData={this.state.datas} fileName={this.state.fileName} />
          </Panel>
        </Collapse>
      </div>
    );
  }
}
