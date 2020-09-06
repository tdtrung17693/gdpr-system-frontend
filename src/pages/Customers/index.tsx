import React from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker } from 'antd';
import Search from 'antd/lib/input/Search';
import '../Customers/index.css';

//components
// import OptionsExport from './Components/OptionsExport/OptionsExport';
import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
import CreateCustomerModal from './Components/CreateCustomerModal/CreateCustomerModal';

import { EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
//const { Option } = Select;

// let resultmock = [
//   {
//     name: 'Long',
//     ipAddress: '111111111111',
//     startDtae: '11111',
//     endDate: '11',
//     owner: '11',
//     status: '11',
//   },
//   {
//     name: 'Who',
//     ipAddress: '111',
//     startDtae: '1111111',
//     endDate: '111111111111111',
//     owner: '11111',
//     status: '111',
//   },
//   {
//     name: 'Dao',
//     ipAddress: '111',
//     startDtae: '1',
//     endDate: '1',
//     owner: '1',
//     status: '1',
//   },
// ];

export default function Customers() {
  return (
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
                    <DatePicker style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
              <Col span={12}>
                <Card hoverable={true} title="ToDate:" bordered={false}>
                  <Input.Group compact>
                    <EditOutlined />
                    <DatePicker style={{ width: '100%' }} />
                  </Input.Group>
                </Card>
              </Col>
            </Row>
          </div>
          <Button type="primary">Process Data</Button>
        </Panel>
      </Collapse>
      <div className="create-filter">
        <div>
          <CreateCustomerModal />
          <ImportButton />
        </div>
        <Search
          style={{ width: '400px' }}
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={(value) => console.log(value)}
        />
      </div>
      <ResultTable />
    </div>
  );
}
