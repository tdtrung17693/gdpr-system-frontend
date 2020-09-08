import * as React from 'react';

import { Row, Dropdown, Menu, Button, Card, Col, Input, Table, Tag, Space } from 'antd';
import UserStore from '../../stores/userStore';
import { L } from '../../lib/abpUtility';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { TablePaginationConfig } from 'antd/lib/table';
import { Key } from 'antd/lib/table/interface';
import lodash from 'lodash'
import CreateOrUpdateUser from './components/createOrUpdateUser';
import RoleStore from '../../stores/roleStore';
import { Store } from 'antd/lib/form/interface';
import { User } from '../../services/user/userService';
import { PlusOutlined } from '@ant-design/icons';

export interface IUserProps {
  userStore: UserStore;
  roleStore: RoleStore;
}

const Search = Input.Search;

@inject(Stores.UserStore, Stores.RoleStore)
@observer
export class Users extends React.Component<IUserProps> {
  modalRef = React.createRef<CreateOrUpdateUser>();
  state = {
    pageSize: 10,
    page: 1,
    filter: "",
    selectedRowKeys: [],
    modalVisible: false,
    editingUserId: ""
  }

  getAll = lodash.throttle(async () => {
    const { pageSize, page, filter } = this.state;
    await this.props.userStore.getAll({ pageSize, page, filterBy: filter })
  }, 500);

  delete(params: any) { }
  async createOrUpdateModalOpen(params: any) {
    if (params.id && params.id.length > 0) {
      await this.props.userStore.get(params.id);
    } else {
      await this.props.userStore.createUser();
    }

    this.setState({
      editingUserId: this.props.userStore.editUser!.id
    })

    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.userStore.editUser);
    });
  }

  toggleModal = (cb: Function = () => { }) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    })
  }

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => {
      console.log(value)
      await this.getAll()
    });
  }

  deactivate = async (ids: string[]) => {
    if (ids.length < 0) return;
    await this.props.userStore.changeUsersStatus(ids, false);
    await this.getAll();
  }

  activate = async (ids: string[]) => {
    if (ids.length < 0) return;
    await this.props.userStore.changeUsersStatus(ids, true);
    await this.getAll();
  }

  handleChangeStatusActions = async (status: boolean) => {
    const { selectedRowKeys } = this.state;
    if (status) {
      await this.activate(selectedRowKeys);
    } else {
      await this.deactivate(selectedRowKeys);
    }
  }

  handleTableChange = (pagination: TablePaginationConfig) => {

    this.setState({ pageSize: pagination.pageSize, page: pagination.current }, async () => await this.getAll());
  }

  handleSave = async (user: User | null, validatingErrors: Store) => {
    if (user) {
      if (this.state.editingUserId) {
        await this.props.userStore.update(this.state.editingUserId, user);
      } else {
        await this.props.userStore.create(user);
      }
      this.toggleModal(async () => {
        await this.getAll();
      });
    }
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
      { title: "Role", dataIndex: 'roleName', width: 150, render: (text: string) => <div style={{ textTransform: "capitalize" }}>{text}</div> },
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
                  {item.status ? <Menu.Item onClick={() => this.deactivate([item.id])}>Deactivate</Menu.Item> : ''}
                  {!item.status ? <Menu.Item onClick={() => this.activate([item.id])}>Activate</Menu.Item> : ''}
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
          >
            <Space size="middle" style={{ marginBottom: "1rem" }}>
              <h2 style={{ display: "inline-block", margin: 0 }}>{L('Users')}</h2>
              <Button
                size="small"
                style={{ display: "inline-block", verticalAlign: "middle" }}
                type="primary"
                onClick={()=>this.createOrUpdateModalOpen({id: ""})}
              >
                  New <PlusOutlined />
              </Button>
            </Space>

          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={L('Filter')} onSearch={this.handleSearch} />
          </Col>
          <Col sm={{ span: 10 }} style={{ marginLeft: "1rem" }}>
            {
              selectedRowKeys.length > 0 ?
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => this.handleChangeStatusActions(true)}>Activate</Menu.Item>
                      <Menu.Item onClick={() => this.handleChangeStatusActions(false)}>Deactivate</Menu.Item>
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
              rowKey={record => String(record.id)}
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
        <CreateOrUpdateUser
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.editingUserId === "" ? 'create' : 'edit'}
          onSave={this.handleSave}
          {...this.props}
        />
      </Card>
    );
  }
}

export default Users;