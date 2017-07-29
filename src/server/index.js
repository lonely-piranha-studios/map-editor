/* eslint-disable no-console, max-len */
import express from 'express';
import ServiceRegister from '@ispy/service-register';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import React from 'react';
import { fromJS } from 'immutable';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { App, routes, createStore } from '../app';

const preRender = Number(CONFIG_SERVER.pre_render); // 0 = Just serve HTML;  1 = Render the initial DOM;  2 = Auth the user and get language then render
const template = fs.readFileSync(path.join(__dirname, '../www', 'index.html'), 'utf8');

const sendDom = (store, req, res) => {
  const app = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App>
          {routes}
        </App>
      </StaticRouter>
    </Provider>
  );
  res.send(template.replace('<div id="app"></div>', `<div id="app">${app}</div>`));
};

const renderApplication = (req, res) => {
  if (!preRender) {
    return res.send(template);
  }
  const store = createStore(fromJS({ cookie: req.cookies }));
  if (preRender === 1) {
    return sendDom(store, req, res);
  }
  // Add login and such HERE
  return sendDom(store, req, res);
};

const serverStart = (port, cb) => {
  express()
    .use(cookieParser())
    .use('/', express.static(path.join(__dirname, '../www'), { index: false }))
    .get('*', renderApplication)
    .post('*', renderApplication)
    .listen(port, () => {
      console.log(`[ SERVER RUNNING | PORT ${port} ]\n\n----[ CONFIG ]--------------------------\n\n`, CONFIG_SERVER, '\n\n----------------------------------------');
      if (typeof cb === 'function') {
        cb();
      }
    });
};

if (CONFIG_SERVER.registervhost) {
  const service = new ServiceRegister(CONFIG_SERVER._vhost); // eslint-disable-line
  service.getFreePort((err, port) => {
    if (err) { throw err; }
    serverStart(port);
  });
} else {
  serverStart(Number(CONFIG_SERVER.port) || 8080);
}
