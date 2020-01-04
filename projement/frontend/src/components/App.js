import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Header from "./layout/Header";
import Alerts from "./layout/Alerts";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";
import ProjectCreate from "./projects/CreateProject";
import ProjectUpdate from "./projects/ProjectUpdate";
import HistoryOfChanges from "./projects/HistoryOfChanges";
import HistoryOfChangesDetail from "./projects/HistoryOfChangesDetail";
import InitialDataOfProject from "./projects/InitialDataOfProject";
import Dashboard from "./tags/Dashboard";

const alertOptions = {
  timeout: 3000,
  position: "top center"
};

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts />
              <div className="container">
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/project/create" component={ProjectCreate} />
                  <Route path='/project/:id/update' component={ProjectUpdate} />
                  <Route path='/project/history' component={HistoryOfChanges} />
                  <Route path='/project/:id/history' component={HistoryOfChangesDetail} />
                  <Route path='/project/:id/initial-data' component={InitialDataOfProject} />

                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
