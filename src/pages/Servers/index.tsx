import React from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Select } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//components
// import OptionsExport from './Components/OptionsExport/OptionsExport';
import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
import CreateServerModal from './Components/CreateServerModal/CreateServerModal';

import { UserOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
let mockusers: string[] = ['long.dao@netpower.no1', 'long.dao@netpower.no2', 'long.dao@netpower.no3'];
let mockadmins: string[] = ['long.dao@netpower.no4', 'long.dao@netpower.no5', 'long.dao@netpower.no6'];
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

export default function Servers() {
  return (
    <div>
      <h2>Servers Management</h2>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Export Requests By Servers" key='0'>
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
              <Col span={6}>
                <Card hoverable={true} title="Requester:" bordered={false}>
                  <Input.Group compact>
                    <UserOutlined />
                    <Select style={{ width: '100%' }}>
                      {mockusers.map((email, index) => {
                        return (
                          <Option value={email} key={index}>
                            {email}
                          </Option>
                        );
                      })}
                    </Select>
                  </Input.Group>
                </Card>
              </Col>
              <Col span={6}>
                <Card hoverable={true} title="Approver:" bordered={false}>
                  <Input.Group compact>
                    <UserOutlined />
                    <Select style={{ width: '100%' }}>
                      {mockadmins.map((email, index) => {
                        return (
                          <Option value={email} key={index}>
                            {email}
                          </Option>
                        );
                      })}
                    </Select>
                  </Input.Group>
                </Card>
              </Col>
            </Row>
          </div>
          <Button type="primary">Process Exports</Button>
        </Panel>
      </Collapse>
      <div className="create-filter">
        <div>
          <CreateServerModal />
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
