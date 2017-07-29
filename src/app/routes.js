import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import auth from '~/utils/routerAuth';

import Index from '~/pages/Index';
import MapNew from '~/pages/MapNew';
import MapEditor from '~/pages/MapEditor';
import Generation from '~/pages/Generation';

const page404 = () => <p>404 page</p>;

export default (
  <Switch>
    <Route path="/" exact component={Index} />
    <Route path="/map-new" component={MapNew} />
    <Route path="/map/:id" component={MapEditor} />
    <Route path="/generation" component={Generation} />
    <Route path="*" component={page404} status="404" />
  </Switch>
);
