import './index.less';

import * as React from 'react';

import moment from 'moment';
import { Avatar, Badge, Col, Dropdown, Empty, Menu, Row, Space, Typography } from 'antd';
import { FileAddTwoTone, BellTwoTone } from '@ant-design/icons'
import {MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons'

import { L } from '../../lib/abpUtility';
import { Link } from 'react-router-dom';

import profilePicture from '../../images/user.png';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import NotificationStore from '../../stores/notificationStore';
import { INotification } from '../../services/notification/notificationService';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  notificationStore?: NotificationStore
}

const {Text} = Typography;

const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to="/logout">
        <LogoutOutlined />
        <span> {L('Logout')}</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/accountsetting">
        <SettingOutlined />
        <span> {L('Setting')}</span>
      </Link>
    </Menu.Item>
  </Menu>
);

const renderNotification = (notification: INotification) => {
  let notificationData = JSON.parse(notification.data)
  let {notificationType, createdAt, id} = notification;

  if (notificationType === "new-request") {
    return (
      <Link to={`/requests/editrequest/${notificationData.RequestId.toLowerCase()}?_fromNotification=${id}`} style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
        <div className="notification-icon">
          <FileAddTwoTone style={{fontSize: "2rem", marginRight: "1rem"}}/>        
        </div>
        <div className="notification-content">
          <Space direction="vertical" size={1}>
            <Text>User <strong>{notificationData.Username}</strong> has sent an access request to the server <strong>{notificationData.ServerName}</strong></Text>
            <Text type="secondary" style={{fontSize: "0.725rem"}}>{moment.utc(createdAt).fromNow()}</Text>
          </Space>
        </div>
      </Link>
    )
  }
  return "";
}

const renderNotificationDropdownMenu = (notifications: any[] = []) => {
  return (<Menu className="notifications" style={{maxHeight: '400px', overflowY: 'auto'}}>
    {
      notifications.length > 0?
      notifications.map(n => {
        return <Menu.Item key={n.id} className="notifications__item">{renderNotification(n)}</Menu.Item>
      }) : <Empty style={{padding: '1rem'}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="You don't have any notifications"/>}
  </Menu>)
}

@inject(Stores.NotificationStore)
@observer
export class Header extends React.Component<IHeaderProps> {
  render() {
    const notifs = this.props.notificationStore?.notifications;
    const MenuIcon = this.props.collapsed  ? MenuUnfoldOutlined : MenuFoldOutlined;
    return (
      <Row className={'header-container'}>
        <Col style={{ textAlign: 'left' }} span={12}>
          <MenuIcon className='trigger' onClick={this.props.toggle} />
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
