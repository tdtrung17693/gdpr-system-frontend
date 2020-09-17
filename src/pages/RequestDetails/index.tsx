import * as React from 'react';
import './index.less';

import { Row, Col } from 'antd';
import qs from 'qs';
import CommentBox from './components/CommentBox';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import NotificationStore from '../../stores/notificationStore';
import CommentStore from '../../stores/commentStore';
import AuthenticationStore from '../../stores/authenticationStore';

interface IRequestDetails {
  match: {params: any};
  notificationStore?: NotificationStore;
  location: any;
  commentStore: CommentStore;
  authenticationStore: AuthenticationStore;
}


interface IRequestDetails {
}

@inject(Stores.CommentStore,  Stores.AuthenticationStore,Stores.NotificationStore)
@observer
export class RequestDetails extends React.Component<IRequestDetails> {
  componentDidMount() {
    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    
    if (notificationId && notificationId != "") {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }
  componentDidUpdate(prevProps: any) {
    const {match: {params}} = this.props
    const {id} = params;
    if (id === prevProps.match.params.id) return;

    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    if (notificationId && notificationId != "") {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <Row>
        <Col span={24}>
          <CommentBox authenticationStore = {this.props.authenticationStore}  requestId={this.props.match.params.id.toLowerCase()}/>
        </Col>
      </Row>
    )
  }
}

export default RequestDetails;