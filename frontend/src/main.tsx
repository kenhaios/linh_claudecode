import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import viVN from 'antd/locale/vi_VN';

import App from './App';
import { store } from './store';
import { vietnameseTheme } from './theme/vietnameseTheme';
import './styles/global.scss';

// Import Vietnamese date picker locale
import 'dayjs/locale/vi';
import dayjs from 'dayjs';

// Set Vietnamese locale for dayjs
dayjs.locale('vi');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ConfigProvider 
          locale={viVN}
          theme={vietnameseTheme}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);