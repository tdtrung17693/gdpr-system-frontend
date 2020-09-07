import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Select } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
import CreateOrEditServerModal from './Components/CreateOrEditServerModal/CreateOrEditServerModal';

import { UserOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
let mockusers: string[] = ['long.dao@netpower.no1', 'long.dao@netpower.no2', 'long.dao@netpower.no3'];
let mockadmins: string[] = ['long.dao@netpower.no4', 'long.dao@netpower.no5', 'long.dao@netpower.no6'];

const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

interface IServers {
  key: string;
  id: string;
  name: string;
  ipAddress: string;
  createBy: string;
  startDate: string;
  endDate: string;
  status: string;
  editButton: any;
  index: number;
}

export default function Servers() {
  const [servers, setServers] = useState<IServers[]>([]);
  useEffect(() => {
    async function getAllServers() {
      let modifiedData: IServers[] = [];
      await axios
        .get(`${url}api/server`, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((res) => {
          let { data }: any = res;
          //console.log(data);
          data.map((server: any, index: number) => {
            let modifiedServer: IServers = {
              key: '' + index,
              id: server.id,
              name: server.name,
              ipAddress: server.ipAddress,
              createBy: server.createdBy,
              startDate: server.startDate,
              endDate: server.endDate,
              status: server.status ? 'active' : 'inactive',
              editButton: (
                <CreateOrEditServerModal key={server.name} serverData = {server} isCreate = {false}/>
              ),
              index: index + 1,
            };
            modifiedData.push(modifiedServer);
          });
        });
      setServers((servers) => [...servers, ...modifiedData]);
    }
    getAllServers();
  }, []);

  return (
    <div>
      <h2>Servers Management</h2>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Export Requests By Servers" key="0">
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
          <CreateOrEditServerModal isCreate serverData/>
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
      <ResultTable data={servers} />
    </div>
  );
}
