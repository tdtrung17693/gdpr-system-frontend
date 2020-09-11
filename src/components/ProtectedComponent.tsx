import * as React from 'react';
import { observer, inject } from 'mobx-react';
import Stores from '../stores/storeIdentifier';
import AuthenticationStore from '../stores/authenticationStore';

interface IProtectedComponentProps {
    authenticationStore: AuthenticationStore;
    requiredPermission: string;
};

@inject(Stores.AuthenticationStore)
@observer
class ProtectedComponent extends React.Component<IProtectedComponentProps> {
    
    render() {
        const {requiredPermission} = this.props;
        return this.props.authenticationStore.isGranted(requiredPermission) ? this.props.children : '';
    }
}