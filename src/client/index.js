import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader'; // AppContainer is a necessary wrapper component for HMR
import { fromJS } from 'immutable';
import cookie from 'cookie';
import 'babel-polyfill';
import 'isomorphic-fetch';

import { App, routes, createStore } from '../app';

// const game = JSON.parse(localStorage.getItem('game') || "{}");
const cookies = cookie.parse(document.cookie);
const store = createStore(fromJS({ cookie: cookies }));

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <App>
            {routes}
          </App>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

render();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../app', () => {
    render();
  });
}
