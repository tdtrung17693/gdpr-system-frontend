import './App.css';

import * as React from 'react';

import Router from './components/Router';
import SessionStore from './stores/sessionStore';

export interface IAppProps {
  sessionStore?: SessionStore;
}

class App extends React.Component<IAppProps> {
  async componentDidMount() {
    //await this.props.sessionStore!.getCurrentLoginInformations();

  }

  public render() {
    return <Router />;
  }
}

export default App;
