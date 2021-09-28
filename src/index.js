import ReactDOM from 'react-dom';
import routers from '@/router/router';
import configureStore from '@/store/configureStore'
import { Provider } from 'react-redux';
import './index.less';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

ReactDOM.render(
  <Provider store={ store }>
    { routers }
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
