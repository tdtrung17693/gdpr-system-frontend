import './index.less';

import * as React from 'react';

import { Avatar, Badge, Col, Dropdown, Empty, Menu, Row, Space } from 'antd';
import { Icon } from '@ant-design/compatible';
import { BellTwoTone } from '@ant-design/icons'

import { L } from '../../lib/abpUtility';
import { Link } from 'react-router-dom';

import profilePicture from '../../images/user.png';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import NotificationStore from '../../stores/notificationStore';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  notificationStore?: NotificationStore
}

const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to="/logout">
        <Icon type="logout" />
        <span> {L('Logout')}</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/accountsetting">
        <Icon type="setting" />
        <span> {L('Setting')}</span>
      </Link>
    </Menu.Item>
  </Menu>
);

const renderNotificationDropdownMenu = (notifications: any[] = []) => {
  return (<Menu className="notifications" style={{maxHeight: '400px', overflowY: 'auto'}}>
    {
      notifications.length > 0?
      notifications.map(n => {
        let requestData = JSON.parse(n.data)
        return <Menu.Item className="notifications__item"><Link to={`/requests/${requestData.RequestId.toLowerCase()}?_fromNotification=${n.id}`}>User {requestData.Username} has sent an access request to the server {requestData.ServerName}</Link> </Menu.Item>
      }) : <Empty style={{padding: '1rem'}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="You don't have any notifications"/>}
  </Menu>)
}

@inject(Stores.NotificationStore)
@observer
export class Header extends React.Component<IHeaderProps> {
  render() {
    const notifs = this.props.notificationStore?.notifications;
    return (
      <Row className={'header-container'}>
        <Col style={{ textAlign: 'left' }} span={12}>
          <Icon className="trigger" type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.props.toggle} />
        </Col>
        <Col style={{ padding: '0px 2rem 0px 2rem' }} span={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '100%' }}>
            <Space size={16} align="center">
              <Dropdown overlay={renderNotificationDropdownMenu(notifs)} trigger={['click']}>
                <Badge style={{}} count={notifs?.length} overflowCount={10}>
                  <BellTwoTone style={{ height: 23, width: 23, fontSize: 23 }} />
                </Badge>
              </Dropdown>
              <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                <Avatar style={{ height: 24, width: 24 }} shape="circle" alt={'profile'} src={profilePicture} />
              </Dropdown>
            </Space>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Header;
