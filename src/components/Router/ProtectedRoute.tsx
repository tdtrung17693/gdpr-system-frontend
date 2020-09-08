import * as React from 'react';

import { Redirect, Route } from 'react-router-dom';

import { inject, observer } from 'mobx-react';

const ProtectedRoute = inject("authenticationStore")(observer((({ authenticationStore, path, component: Component, permission, render, ...rest }: any) => {
  console.log(authenticationStore)
  return (
    <Route
      {...rest}
      render={props => {
        if (!authenticationStore.isAuthenticated)
          return (
            <Redirect
              to={{
                pathname: '/user/login',
                state: { from: props.location },
              }}
            />
          );

        if (permission && authenticationStore.user.permissions.indexOf(permission) < 0) {
          return (
            <Redirect
              to={{
                pathname: '/exception?type=401',
                state: { from: props.location },
              }}
            />
          );
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
})));

export default ProtectedRoute;
