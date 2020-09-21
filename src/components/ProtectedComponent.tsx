import React from 'react';
import { observer, inject } from 'mobx-react';
import Stores from '../stores/storeIdentifier';
import AuthenticationStore from '../stores/authenticationStore';

interface IProtectedComponentProps {
    authenticationStore?: AuthenticationStore;
    requiredPermission: string;
    children?: any;
    style?: React.CSSProperties
};

const ProtectedComponent = inject(Stores.AuthenticationStore)(observer((props: IProtectedComponentProps) => {
    const {authenticationStore: auth, requiredPermission} = props;
    return auth?.isGranted(requiredPermission) ? props.children : '';
}));

export default ProtectedComponent;