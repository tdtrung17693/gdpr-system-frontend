import * as React from 'react';

import AuthenticationStore from '../../stores/authenticationStore';
import Stores from '../../stores/storeIdentifier';
import { inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import signalRService from '../../services/signalRService';
import NotificationStore from '../../stores/notificationStore';

export interface ILogoutProps {
  authenticationStore?: AuthenticationStore;
  notificationStore?: NotificationStore;
}

@inject(Stores.AuthenticationStore, Stores.NotificationStore)
class Logout extends React.Component<ILogoutProps> {
  async componentDidMount() {
    let currentUser = this.props.authenticationStore?.user;
    await this.props.notificationStore?.stopListeningNotifications(String(currentUser?.id));
    await this.props.authenticationStore!.logout();
    signalRService.stop();
  }
  render() {
    return <Redirect to="/user/login"/>
  }
}

export default Logout;
