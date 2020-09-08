import './index.less';

import * as React from 'react';

import { Avatar, Col, Layout, Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import { L } from '../../lib/abpUtility';

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
  authenticationStore?: AuthenticationStore;
}

const SiderMenu = inject(Stores.AuthenticationStore)(observer((props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  return (
    <Sider trigger={null} className={'sidebar'} width={256} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      {collapsed ? (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 50, width: 50 }} src={GdprLogo} />
        </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 100, width: 100 }} src={GdprLogo} />
        </Col>
      )}

      <Menu theme="dark" mode="inline">
        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu)
          .map((route: any, index: number) => {
            if (route.permission && !props.authenticationStore?.isGranted(route.permission)) return null;

            return (
              <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                <Icon type={route.icon} />
                <span>{L(route.title)}</span>
              </Menu.Item>
            );
          })}
      </Menu>
    </Sider>
  );
}));

export default SiderMenu;
