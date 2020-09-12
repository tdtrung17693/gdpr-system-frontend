import * as React from 'react';

import { Row, Dropdown, Menu, Button, Card, Col, Input, Table, Tag, Space, message } from 'antd';
import UserStore from '../../stores/userStore';
import { L } from '../../lib/abpUtility';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { TablePaginationConfig, ColumnProps } from 'antd/lib/table';
import { Key, SorterResult } from 'antd/lib/table/interface';
import lodash from 'lodash'
import CreateOrUpdateUser from './components/createOrUpdateUser';
import RoleStore from '../../stores/roleStore';
import { Store } from 'antd/lib/form/interface';
import { User } from '../../services/user/userService';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';

export interface IUserProps {
  userStore: UserStore;
  roleStore: RoleStore;
}

interface UsersTableState  {
  pageSize: number;
  page: number;
  searchQuery: string;
  filteredInfo: Record<string, Key[] | null>;
  sortedBy: string;
  sortOrder: string;
  selectedRowKeys: string[];
  modalVisible: boolean;
  editingUserId: string;
}

const Search = Input.Search;

@inject(Stores.UserStore, Stores.RoleStore)
@observer
export class Users extends React.Component<IUserProps> {
  modalRef = React.createRef<CreateOrUpdateUser>();
  userTableRef:any = React.createRef();
  state: UsersTableState = {
    pageSize: 10,
    page: 1,
    searchQuery: "",
    filteredInfo: {},
    sortedBy: "",
    sortOrder: "",
    selectedRowKeys: [],
    modalVisible: false,
    editingUserId: ""
  }

  getAll = lodash.throttle(async () => {
    const { pageSize, page, searchQuery, sortedBy, sortOrder } = this.state;
    await this.props.userStore.getAll({ pageSize, page, filterBy: searchQuery, sortedBy, sortOrder })
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
    this.setState({ page: 1, searchQuery: value, filteredInfo: {} }, async () => {
      await this.getAll()
    });
  }

  deactivate = async (ids: string[]) => {
    if (ids.length < 0) return;
    this.waitForProcess(async () => {
      await this.props.userStore.changeUsersStatus(ids, false);
      this.setState({
        selectedRowKeys: []
      })
      await this.getAll();
    }, "Action completed", "Action failed");
  }

  activate = async (ids: string[]) => {
    if (ids.length < 0) return;
    this.waitForProcess(async () => {
      await this.props.userStore.changeUsersStatus(ids, true);
      this.setState({
        selectedRowKeys: []
      })
      await this.getAll();
    }, "Action successfully completed", "Action failed");
  }

  handleChangeStatusActions = async (status: boolean) => {
    const { selectedRowKeys } = this.state;
    if (status) {
      await this.activate(selectedRowKeys);
    } else {
      await this.deactivate(selectedRowKeys);
    }
  }

  handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, Key[] | null>, sorter: SorterResult<User> | SorterResult<User>[]) => {
    let sortOrder = 'asc';
    let sortedBy = '';
    let filterString = "";
    if (!Array.isArray(sorter)) {
      sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      sortedBy = String(sorter.columnKey);
    }
    if (filters.status) {
      let statusValue = filters.status[0] === "true" ? true : false;
      filterString = `status:${statusValue}`
    }
    if (filters.roleId) {
      if (filterString !== "") filterString += ",";
      filterString += `roleId:${filters.roleId[0]}`
    }
    this.setState({ pageSize: pagination.pageSize, filteredInfo: filters, page: pagination.current, sortOrder, sortedBy, searchQuery: filterString }, async () => await this.getAll());

  }

  waitForProcess = async (processingFn: Function, successMsg: string, errorMsg: string) => {
    message.loading({ content: 'Processing...', key: 'user:process', duration: 0});
    try {
      await processingFn();
      message.success({ content: successMsg, key: 'user:process', duration: 5 });
    } catch (e) {
      message.error({ content: errorMsg, key: 'user:process', duration: 5 });
      throw e;
    }
  }

  handleSave = async (user: User | null, validatingErrors: Store) => {
    if (user) {
      await this.waitForProcess(async () => {
        if (this.state.editingUserId) {
          await this.props.userStore.update(this.state.editingUserId, user);
        } else {
          await this.props.userStore.create(user);
        }

        this.toggleModal(async () => {
          await this.getAll();
        });
      }, "User is saved successfully", "User cannot be saved. Please check again.");
    }
  }

  onSelectChange = (selectedRowKeys: Key[]) => {
    this.setState({ selectedRowKeys });
  };

  componentDidMount() {
    this.getAll();
  }

  render() {
    const { users, loading } = this.props.userStore;
    const { page, pageSize, selectedRowKeys, filteredInfo } = this.state;
    const filtersRole = this.props.roleStore.roles.reduce((acc: any[], r) => {
      acc.push({
        text: r.name,
        value: r.id
      })

      return acc;
    }, []);

    const columns:ColumnProps<User>[] = [
      { title: "Username", dataIndex: 'username', key: 'Username', width: 150, render: (text: string) => <div>{text}</div>, sorter: true, sortDirections: ['ascend', 'descend', 'ascend'] },
      { title: "First Name", dataIndex: 'firstName', key: 'FirstName', width: 150, render: (text: string) => <div>{text}</div>, sorter: true, sortDirections: ['ascend', 'descend', 'ascend'] },
      { title: "Last Name", dataIndex: 'lastName', key: 'LastName', width: 150, render: (text: string) => <div>{text}</div>, sorter: true, sortDirections: ['ascend', 'descend', 'ascend'] },
      { title: "Email", dataIndex: 'email', key: 'Email', width: 150, render: (text: string) => <div>{text}</div>, sorter: true, sortDirections: ['ascend', 'descend', 'ascend'] },
      {
        title: "Role",
        key: 'roleId',
        width: 150,
        filters: filtersRole,
        filterMultiple: false,
        filteredValue: filteredInfo.roleId || null ,
        render: (text: string, record: User) => <div style={{ textTransform: "capitalize" }}>{record.roleName}</div>
      },
      {
        title: "Active",
        dataIndex: 'status',
        width: 150,
        filters: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false },
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.status || null ,
        render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>),
      },
      {
        title: 'Actions',
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
      <>
      <Space size="middle" style={{ marginBottom: "1rem" }}>
        <Title style={{ display: "inline-block", margin: 0 }} level={2}>Users</Title>
        <Button
          size="small"
          style={{ display: "inline-block", verticalAlign: "middle" }}
          type="primary"
          onClick={()=>this.createOrUpdateModalOpen({id: ""})}
        >
            New <PlusOutlined />
        </Button>

      </Space>
      <Card>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder="Search users" onSearch={this.handleSearch} />
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
            <Table<User>
              rowKey={record => String(record.id)}
              rowSelection={rowSelection}
              size="middle"
              bordered={true}
              columns={columns}
              pagination={{ pageSize, total: users === undefined ? 0 : users.totalItems,current: page, defaultCurrent: 1 }}
              loading={loading}
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
      </>
    );
  }
}

export default Users;