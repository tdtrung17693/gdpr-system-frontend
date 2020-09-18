import React from 'react';
import { Collapse, Card, Col, Row, Input, DatePicker, Button } from 'antd';
import { Component } from 'react';
import { EditOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import http from '../../../../services/httpService';
//import moment from 'moment';
// import { Moment } from 'moment';
// import { stringify } from 'querystring';

const { Panel } = Collapse;

export default class ExportCollapse extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      index: '',
      datas: [],
      fileName: 'excel',
      fromDate: Date(),
      toDate: Date(),
      guids: []
    };
    this.handleExportClick = this.handleExportClick.bind(this);
  }

  exportToCSV = (csvData: unknown[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }

  handleExportClick = () => {
    console.log(this.state.fromDate)
    console.log(this.state.toDate)
    http.post(`api/Request/exportRequest`, {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      guids: [
        'B2039BE6-AD14-4B07-A4B1-C605E293571A'
      ]
    })
      .then((requests) => {
        this.setState({
          datas: requests.data,
        });
        console.log(this.state.datas)
        this.exportToCSV(this.state.datas, 'excel')
      })
      .catch((error) => {
        console.log(error);
      });


  }


  getRequestsData() {
    http
      .get(`api/Request`)
      .then((requests) => {
        this.setState({
          datas: requests.data,
        });
        console.log((this.state.datas) ? this.state.datas : "No data")
      })
      .catch((error) => {
        console.log(error);
      });
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
                      <DatePicker style={{ width: '100%' }} onChange={(date) => { this.setState({ fromDate: date }) }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable={true} title="ToDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker style={{ width: '100%' }} onChange={(date) => { this.setState({ toDate: date }) }} />
                    </Input.Group>
                  </Card>
                </Col>
              </Row>
            </div>
            <Button type='primary' onClick={() => { this.handleExportClick() }}>Export</Button>
          </Panel>
        </Collapse>
      </div>
    );
  }
}
