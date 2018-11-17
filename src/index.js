import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'babel-polyfill';
import './css/index.css';
import App from './App';
import './css/app.css';
import {BrowserRouter} from "react-router-dom";
import {Route, Switch} from "react-router";


function wrapApp(RootComponent) {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="*" component={RootComponent} />
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(wrapApp(App), document.getElementById('root'));
