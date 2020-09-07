import React from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker } from 'antd';
import Search from 'antd/lib/input/Search';
import '../Customers/index.css';
import axios from 'axios';

import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
import CreateCustomerModal from './Components/CreateCustomerModal/CreateCustomerModal';

import { EditOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Panel } = Collapse;



const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData: any, fileName: any) => {
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(data, fileName + fileExtension);
}


export default class Customers extends React.Component {
  state = {
    fromDate: Date(),
    toDate: Date(),
    guids: []
  };

  handleExport = (e: any) => {
    axios.post('http://localhost:5000/api/Customer/export-csv', {
    fromDate: this.state.fromDate,
    toDate: this.state.toDate,
    guids: this.state.guids,
  })
    .then((response) =>{
      console.log(response.data.responsedRequest);
      exportToCSV(response.data.responsedRequest, 'xfilename');
    })
    .catch(function (error) {
      console.log(error);
    });
    //console.log(e.target.value);
  }

  render(){ return (
    <div>
      <h2>Customers Management</h2>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Export Requests By Customers" key='0'>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={12}>
                <Card hoverable={true} title="FromDate:" bordered={false}>
                  <Input.Group compact>
                    <EditOutlined />
                    <DatePicker onChange={value => this.setState({fromDate: value})} style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
              <Col span={12}>
                <Card hoverable={true} title="ToDate:" bordered={false}>
                  <Input.Group compact>
                    <EditOutlined />
                    <DatePicker onChange={value => this.setState({toDate: value})} style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
            </Row>
          </div>
          <Button type="primary" onClick={this.handleExport}>Process Data</Button>
        </Panel>
      </Collapse>
      <div className="create-filter">
        <div>
          <CreateCustomerModal />
          <ImportButton />
        </div>
        <Search
          style={{ width: '400px' }}
          placeholder="Search Keyword"
          enterButton="Search"
          size="large"
          onSearch={(value) => console.log(value)}
        />
      </div>
      <ResultTable />
    </div>
  );
  }
}
