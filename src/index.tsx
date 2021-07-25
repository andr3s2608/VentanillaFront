import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Redux
import { Provider } from 'react-redux';
import { store } from 'app/redux/app.reducers';

// Main Component
import AzureAuth from 'app/core/azureauth.module';

// Traducir componentes
import ConfigProvider from 'antd/es/config-provider';
import es_ES from 'antd/es/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';

// Styles
import './scss/antd/index.css';
import './scss/index.scss';

//#region Configurar Español

moment.updateLocale('es', {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  invalidDate: 'Fecha invalida',
  weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
});
moment.locale('es');

//#endregion

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      {/* eslint-disable-next-line no-template-curly-in-string */}
      <ConfigProvider locale={es_ES} form={{ validateMessages: { required: '${label} es un campo obligatorio.' } }}>
        <AzureAuth />
      </ConfigProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
