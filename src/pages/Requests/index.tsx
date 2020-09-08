import React from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//components
import ResultTable from './Components/ResultTable/ResultTable';
import CreateServerModal from './Components/CreateModal/CreateModal';

import {EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;


export default function Requests() {
  return (
    <div>
      <h2>Requests Management</h2>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Export Requests" key='0'>
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
          <Button type="primary">Export</Button>
        </Panel>
      </Collapse>
      <div className="create-filter">
        <div>
          <CreateServerModal />
        </div>
        <Search
          style={{ width: '400px' }}
          enterButton="Search"
          size="large"
          onSearch={(value) => console.log(value)}
        />
      </div>
      <ResultTable />
    </div>
  );
}
