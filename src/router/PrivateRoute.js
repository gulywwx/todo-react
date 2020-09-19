import React from "react";
import { Route, Redirect } from "react-router-dom";
import store from "@/store";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = store.getState().user.isLogined;

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page

    <Route
      {...rest}
      render={(props) =>
        isLogin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
export { PrivateRoute };
