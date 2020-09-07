import * as React from 'react';

import { Row, Dropdown, Menu, Button, Card, Col, Input, Table, Tag } from 'antd';
import UserStore from '../../stores/userStore';
import { L } from '../../lib/abpUtility';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { TablePaginationConfig } from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import lodash from 'lodash'

export interface IUserProps {
  userStore: UserStore;
}

const Search = Input.Search;

@inject(Stores.UserStore)
@observer
export class Users extends React.Component<IUserProps> {
  state = {
    pageSize: 10,
    page: 1,
    filter: "",
    selectedRowKeys: []
  }

  getAll = lodash.throttle(async () => {
    const { pageSize, page, filter } = this.state;
    await this.props.userStore.getAll({ pageSize, page, filterBy: filter })
  }, 500);

  delete(params: any) { }
  createOrUpdateModalOpen(params: any) { }
  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => {
      console.log(value)
      await this.getAll()
    });
  }
  handleTableChange = (pagination: TablePaginationConfig) => {

    this.setState({ pageSize: pagination.pageSize, page: pagination.current }, async () => await this.getAll());
  }

  onSelectChange = (selectedRowKeys: Key[]) => {
    this.setState({ selectedRowKeys });
  };

  componentDidMount() {
    this.getAll();
  }

  render() {
    const { users } = this.props.userStore;
    const { pageSize, selectedRowKeys } = this.state;
    const columns = [
      { title: "Username", dataIndex: 'username', width: 150, render: (text: string) => <div>{text}</div> },
      { title: "First Name", width: 150, render: (text: string, record: any) => <div>{record.firstName}</div> },
      { title: "Last Name", width: 150, render: (text: string, record: any) => <div>{record.lastName}</div> },
      { title: "Email", dataIndex: 'email', width: 150, render: (text: string) => <div>{text}</div> },
      {
        title: "Active",
        dataIndex: 'status',
        width: 150,
        render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>),
      },
      {
        title: L('Actions'),
        width: 150,
        render: (text: string, item: any) => (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.id })}>Edit</Menu.Item>
                  <Menu.Item onClick={() => this.delete({ id: item.id })}>Delete</Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary" >
                Actions
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            {' '}
            <h2>{L('Users')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary" shape="circle" onClick={() => { }} />
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={L('Filter')} onSearch={this.handleSearch} />
          </Col>
          <Col sm={{ span: 10 }} style={{marginLeft: "1rem"}}>
            {
            selectedRowKeys.length > 0 ?
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item>Activate</Menu.Item>
                    <Menu.Item>Deactivate</Menu.Item>
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Button type="primary" >Bulk Actions</Button>
              </Dropdown>
            : ""}

          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <Table
              rowKey={record => record.id.toString()}
              rowSelection={rowSelection}
              size="middle"
              bordered={true}
              columns={columns}
              pagination={{ pageSize, total: users === undefined ? 0 : users.totalItems, defaultCurrent: 1 }}
              loading={users === undefined ? true : false}
              dataSource={users === undefined ? [] : users.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        {/* <CreateOrUpdateUser
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.userId === 0 ? 'edit' : 'create'}
          onCreate={this.handleCreate}
          roles={this.props.userStore.roles}
        /> */}
      </Card>
    );
  }
}

export default Users;