import * as React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';
import { CheckOutlined, DeleteOutlined, EllipsisOutlined, FileAddTwoTone } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, Dropdown, Empty, Menu, Popconfirm, Space, Typography } from 'antd';

import Stores from '../../stores/storeIdentifier';
import NotificationStore from '../../stores/notificationStore';
import { INotification } from '../../services/notification/notificationService';

import './index.less';

const { Title, Text } = Typography;

interface INotificationProps {
  notificationStore?: NotificationStore;
}

interface INotificationState {
  hasMore: boolean;
  loading: boolean;
  currentPage: number;
  currentContextMenuId: string;
}


@inject(Stores.NotificationStore)
@observer
class NotificationList extends React.Component<INotificationProps> {
  state: INotificationState = {
    loading: false,
    hasMore: this.props.notificationStore?.hasMore!,
    currentPage: 1,
    currentContextMenuId: '',
  };
  reanderContextMenu = (notificationId: string) => {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => {
          this.props.notificationStore?.markAsRead(notificationId);
        }}>

          <CheckOutlined /> Mark as read</Menu.Item>

        <Menu.Item key="2">
          <Popconfirm
            title="Are you sure delete this notification?"
            onConfirm={() => {
              this.props.notificationStore?.delete(notificationId);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined /> Delete
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    return menu;
  };

  markAllAsRead = (ev: any) => {
    ev.preventDefault();
    this.props.notificationStore?.markAllAsRead();
  };

  handleLoadMore = async (page: number) => {
    const result = await this.props.notificationStore?.getMoreNotifications(page);
    this.setState({
      hasMore: result?.page! < result?.totalPages!,
    });
  };
  renderNotification = (notification: INotification) => {
    let notificationData = JSON.parse(notification.data);
    let { notificationType, createdAt, id } = notification;

    if (notificationType === 'new-request') {
      return (
        <Menu.Item
          className={classNames({ 'notifications__item': true, 'notifications__item--unread': !notification.isRead })}
          key={notification.id}>
          <div className="notification">
            <Link to={`/requests/editrequest/${notificationData.RequestId.toLowerCase()}?_fromNotification=${id}`}
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <div className="notification-icon">
                <FileAddTwoTone style={{ fontSize: '2rem', marginRight: '1rem' }} />
              </div>
              <div className="notification-content">
                <Space direction="vertical" size={1}>
                  <Text>User <strong>{notificationData.Username}</strong> has sent an access request to the
                    server <strong>{notificationData.ServerName}</strong></Text>
                  <Text className="notifications__item-time" type="secondary"
                        style={{ fontSize: '0.725rem' }}>{moment.utc(createdAt).fromNow()}</Text>
                </Space>
              </div>
              {!notification.isRead ? <div className="notifications__unread-notificator" /> : ''}
            </Link>
            <Dropdown onVisibleChange={(visible) => {
              this.setState({ currentContextMenuId: visible ? notification.id : '' });
            }} visible={this.state.currentContextMenuId == notification.id}
                      overlay={this.reanderContextMenu(notification.id)} trigger={['click']}>
              <EllipsisOutlined className="notifications__item-action-menu"
                                style={this.state.currentContextMenuId == notification.id ? { opacity: 1 } : {}} />
            </Dropdown>
          </div>
        </Menu.Item>
      );
    } else if (notificationType === 'request-accept-reject') {
      return (
        <Menu.Item
          className={classNames({ 'notifications__item': true, 'notifications__item--unread': !notification.isRead })}
          key={notification.id}>
          <div className="notification">
            <Link to={`/requests/editrequest/${notificationData.RequestId.toLowerCase()}?_fromNotification=${id}`}
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <div className="notification-icon">
                <FileAddTwoTone style={{ fontSize: '2rem', marginRight: '1rem' }} />
              </div>
              <div className="notification-content">
                <Space direction="vertical" size={1}>
                  <Text>Your request <strong>{notificationData.RequestTitle}</strong> has been {notificationData.NewStatus === 'closed' ? 'rejected' : 'approved'}</Text>
                  <Text className="notifications__item-time" type="secondary"
                        style={{ fontSize: '0.725rem' }}>{moment.utc(createdAt).fromNow()}</Text>
                </Space>
              </div>
              {!notification.isRead ? <div className="notifications__unread-notificator" /> : ''}
            </Link>
            <Dropdown onVisibleChange={(visible) => {
              this.setState({ currentContextMenuId: visible ? notification.id : '' });
            }} visible={this.state.currentContextMenuId == notification.id}
                      overlay={this.reanderContextMenu(notification.id)} trigger={['click']}>
              <EllipsisOutlined className="notifications__item-action-menu"
                                style={this.state.currentContextMenuId == notification.id ? { opacity: 1 } : {}} />
            </Dropdown>
          </div>
        </Menu.Item>
      );
    }
    return '';
  };

  render() {
    const notifications = this.props.notificationStore?.notifications;
    const { hasMore } = this.state;

    return (
      <div className="notifications">
        <div className="notifications__header">
          <Title level={4}>Notifications</Title>
          <div><Button htmlType="button" type="link" onClick={this.markAllAsRead}>Mark all as read</Button></div>
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <InfiniteScroll
            initialLoad={false}
            loader={<div className="loader" key={0}>Loading ...</div>}
            pageStart={1}
            loadMore={this.handleLoadMore}
            hasMore={hasMore}
            threshold={400}
            useWindow={false}>
            <Menu>
              {
                notifications && notifications.length > 0 ?
                  notifications.map(n => {
                    return this.renderNotification(n);
                  }) : <Menu.Item style={{ height: 'auto', pointerEvents: 'none' }}><Empty style={{ padding: '1rem' }}
                                                                                           image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                                                           description="You don't have any notifications" /></Menu.Item>
              }
            </Menu>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default NotificationList;