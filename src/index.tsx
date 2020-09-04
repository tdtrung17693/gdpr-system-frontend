import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Utils from './utils/utils';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';

declare var abp: any;

Utils.setLocalization();


moment.locale(abp.localization.currentLanguage.name);

if (abp.clock.provider.supportsMultipleTimezone) {
  moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
}

const stores = initializeStores();

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
