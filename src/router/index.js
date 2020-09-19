import React from "react";
import Login from "../views/Login.js";
import Register from "../views/Register.js";
import Home from "../views/Home.js";
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute component={Home}></PrivateRoute>
      </Switch>
    );
  }
}

export default Routes;
