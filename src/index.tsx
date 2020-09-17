import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Utils from './utils/utils';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
import { Spin } from 'antd';
import Text from 'antd/lib/typography/Text';

Utils.setLocalization();


class LoadingScreenWrapper extends React.Component {
  state = { isInitialized: false, stores: {} }
  async componentDidMount() {
    const stores = await initializeStores()
    this.setState({isInitialized: true, stores})
  }

  render() {
    const {stores} = this.state
    return (<>
    {
      !this.state.isInitialized ?
        <div className="loading-screen">
          <Spin size="large" style={{transform: 'scale(2)'}}/>
          <div><Text type="secondary" className="blinking-text">Loading...</Text></div>
        </div> :
        <Provider {...stores}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
    }
    </>)
  }
}

ReactDOM.render(
  <LoadingScreenWrapper />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
