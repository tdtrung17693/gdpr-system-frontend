import './index.less';

import * as React from 'react';

import { Avatar, Col, Layout, Menu } from 'antd';
import { Icon } from '@ant-design/compatible';

import GdprLogo from '../../images/gdpr.svg';
import { appRouters } from '../../components/Router/router.config';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AuthenticationStore from '../../stores/authenticationStore';

const { Sider } = Layout;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: any;
  history: any;
  location?: any;
  authenticationStore?: AuthenticationStore;
  style?: React.CSSProperties
}

const SiderMenu = inject(Stores.AuthenticationStore)(observer((props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  return (
    <Sider 
      trigger={null}
      className={'sidebar'}
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={props.style}
    >
      {collapsed ? (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 50, width: 50 }} src={GdprLogo} />
        </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 100, width: 100 }} src={GdprLogo} />
        </Col>
      )}

      <Menu theme="dark" mode="inline" selectedKeys={[props.location.pathname]}>
        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu)
          .map((route: any, index: number) => {
            console.log(route.path,route.permission, props.authenticationStore?.user, props.authenticationStore?.isGranted(route.permission))
            if (route.permission && !props.authenticationStore?.isGranted(route.permission)) return null;

            return (
              <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                <Icon type={route.icon} />
                <span>{route.title}</span>
              </Menu.Item>
            );
          })}
      </Menu>
    </Sider>
  );
}));

export default SiderMenu;
