import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Dconge from './Dconge'; 
import listeDc from './listeDc';
import Mission from './mission';
import Dautorisation from './Dautorisation';
import DAbsence from './DAbsence';
import Dcomplement from './Dcomplement';
import Dremboursement from './Dremboursement';
import grh from './grh';
import DC from './DC';
import listeemployee from './listeemployee';
const DemandeRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/demande-conge`} />
        <Route path={`${match.url}/demande-conge`} component={Dconge} />
        <Route path={`${match.url}/listeDc`} component={listeDc} />
        <Route path={`${match.url}/mission`} component={Mission} />
        <Route path={`${match.url}/Dautorisation`} component={Dautorisation} />
        <Route path={`${match.url}/DAbsence`} component={DAbsence} />
        <Route path={`${match.url}/Dcomplement`} component={Dcomplement} />
        <Route path={`${match.url}/Dremboursement`} component={Dremboursement} />
        <Route path={`${match.url}/grh`} component={grh} />
        <Route path={`${match.url}/DC`} component={DC} />
        <Route path={`${match.url}/listeemployee`} component={listeemployee} />

    </Switch>
);

export default DemandeRoute;
