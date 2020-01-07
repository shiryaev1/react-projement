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
import ProjectUpdate from "./project/ProjectUpdate";
import HistoryOfChanges from "./project/HistoryOfChanges";
import HistoryOfChangesDetail from "./project/HistoryOfChangesDetail";
import InitialDataOfProject from "./project/InitialDataOfProject";
import Dashboard from "./tags/Dashboard";
import DashboardProject from "./project/Dashboard";
import TagAddingHistory from "./tags/TagAddingHistory";
import TagUpdate from "./tags/TagUpdate";

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
                  <PrivateRoute exact path="/projects" component={DashboardProject} />
                  <Route path='/project/:id/update' component={ProjectUpdate} />
                  <Route path='/project/history' component={HistoryOfChanges} />
                  <Route path='/project/:id/history' component={HistoryOfChangesDetail} />
                  <Route path='/project/:id/initial-data' component={InitialDataOfProject} />
                  <Route path='/tags/history' component={TagAddingHistory} />
                  <Route path='/tag/:id/:title/update' component={TagUpdate} />
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
