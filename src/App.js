import React, { Component } from 'react';
import './css/app.css';
import {HOME} from "./const";
import Home from "./pages/Home";
import {Redirect, Route, Switch} from "react-router";

function App() {
    return (
        <main id="main-content">
            <div>
                <Switch>
                    <Route
                        exact
                        path={HOME}
                        component={Home}
                    />
                    <Route path="*" render={() => <Redirect to={HOME} />} />
                </Switch>
            </div>
        </main>
    );
}


export default App;
