import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import grh from './grh';
const RHRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/grh`} />
        <Route path={`${match.url}/grh`} component={grh} />



    </Switch>
);

export default RHRoute;
