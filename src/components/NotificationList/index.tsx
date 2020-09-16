import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import moment from 'antd/node_modules/moment';
import { FileAddTwoTone } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { Empty, Menu, Space, Typography } from 'antd';

import Stores from '../../stores/storeIdentifier';
import NotificationStore from '../../stores/notificationStore';
import { INotification } from '../../services/notification/notificationService';

import './index.less';

const { Title, Text } = Typography;

interface INotificationProps {
    notificationStore?: NotificationStore;
}

interface INotificationState {
    loading: boolean;
    currentPage: number;
    hasMore: boolean;
}

@inject(Stores.NotificationStore)
@observer
class NotificationList extends React.Component<INotificationProps> {
    state: INotificationState = {
        loading: false,
        currentPage: 1,
        hasMore: true
    }

    handleLoadMore = async (page: number) => {
        console.log(page)
        const length = await this.props.notificationStore?.getMoreNotifications(page)
        this.setState({
            hasMore: length < 5
        })
    }
    renderNotification = (notification: INotification) => {
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

    render() {
        const notifications = this.props.notificationStore?.notifications;
        const { hasMore } = this.state;
        console.log(hasMore)

        return (
            <div className="notifications">
                <div className="notifications__header">
                    <Title level={4}>Notifications</Title>
                </div>
                <div style={{maxHeight: 400, overflow: 'auto'}}>
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
                            notifications && notifications.length > 0?
                            notifications.map(n => {
                            return <Menu.Item style={!n.isRead ? {backgroundColor: '#ececec'} : {}} key={n.id} className="notifications__item">{this.renderNotification(n)}</Menu.Item>
                            }) : <Empty style={{padding: '1rem'}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="You don't have any notifications"/>
                        }
                        </Menu>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}

export default NotificationList