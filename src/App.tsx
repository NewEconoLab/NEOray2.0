import * as React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider, observer } from "mobx-react";
import { IntlProvider, addLocaleData } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import Layout from './containers/layout/index';
import routes from './routers';
import store from "./store";
addLocaleData([ ...en, ...zh ]);
// 初始化请求

store[ 'common' ].initLanguage();

const ObserverRender = observer(() => {
  let locale = 'en';

  if (store[ 'common' ].language === 'zh') {
    locale = 'zh';
  }

  return (
    <IntlProvider
      key={ locale }
      locale={ locale }
      messages={ store[ 'common' ].message }
    >
      {
        renderRoutes(routes)
      }
    </IntlProvider>
  )
});

export default () => {
  if (process.env.REACT_APP_SERVER_ENV === 'DEV') {
    return (
      <Provider { ...store }>
        <BrowserRouter basename="neo3">
          <Layout>
            <Switch>
              <ObserverRender />
            </Switch>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  }
  return (
    <Provider { ...store }>
      <BrowserRouter basename="neo3">
        <Layout>
          <Switch>
            <ObserverRender />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};
  