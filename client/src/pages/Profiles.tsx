import React, { Component } from "react";
import { Switch, Route } from "react-router";
import Profile from "./Profile";

class Profiles extends Component {
  public render() {
    return (
      <Switch>
        <Route path="/profiles/:userId">
          <Profile />
        </Route>
        <Route>
          <div>No profile found.</div>
        </Route>
      </Switch>
    );
  }
}

export default Profiles;
