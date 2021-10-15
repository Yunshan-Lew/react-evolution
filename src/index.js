import ReactDOM from 'react-dom';
import routers from '@/router/router';
import configureStore from '@/store/configureStore'
import { Provider } from 'react-redux';
import { ConfigProvider, message } from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import '@/style/style.less';
import reportWebVitals from './reportWebVitals';

moment.locale('zh-cn')
message.config({ top: '15%' })

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    <ConfigProvider locale={ zhCN }>
      { routers }
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
