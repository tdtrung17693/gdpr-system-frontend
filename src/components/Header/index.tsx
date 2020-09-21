import './index.less';

import * as React from 'react';

import { Avatar, Badge, Col, Dropdown, Menu, Row, Space } from 'antd';
import { BellTwoTone } from '@ant-design/icons';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

import profilePicture from '../../images/user.png';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import NotificationStore from '../../stores/notificationStore';
import NotificationList from '../NotificationList';
import { userRouter } from '../Router/router.config';
import AuthenticationStore from '../../stores/authenticationStore';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  notificationStore?: NotificationStore
  authenticationStore?: AuthenticationStore
}


const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to={{ pathname: userRouter.find((r: any) => r.name === 'logout').path }}>
        <LogoutOutlined style={{ marginRight: '0.5rem' }} />
        <span>Logout</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/accountsettings">
        <SettingOutlined style={{ marginRight: '0.5rem' }} />
        <span>Settings</span>
      </Link>
    </Menu.Item>
  </Menu>
);


@inject(Stores.NotificationStore, Stores.AuthenticationStore)
@observer
export class Header extends React.Component<IHeaderProps> {
  render() {
    const currentUser = this.props.authenticationStore!.user;
    const totalUnread = this.props.notificationStore?.totalUnreadNotifications;
    const MenuIcon = this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
    return (
      <Row className={'header-container'}>
        <Col style={{ textAlign: 'left' }} span={12}>
          <MenuIcon className='trigger' onClick={this.props.toggle} />
        </Col>
        <Col style={{ padding: '0px 2rem 0px 2rem' }} span={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch', minHeight: '100%' }}>
            <Space size={16} style={{ alignItems: 'stretch' }} className="header-popup">
              <Dropdown overlay={<NotificationList />} trigger={['click']}>
                <Badge style={{}} count={totalUnread} overflowCount={10}>
                  <BellTwoTone style={{ height: 23, width: 23, fontSize: 23 }} />
                </Badge>
              </Dropdown>
              <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                <div>
                  <Space>
                    <span style={{ fontWeight: 700 }}>{currentUser?.firstName} {currentUser?.lastName}</span>
                    <Avatar style={{ height: 24, width: 24 }} shape="circle" alt={'profile'} src={profilePicture} />
                  </Space>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Header;
