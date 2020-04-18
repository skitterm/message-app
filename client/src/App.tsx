import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setUserId, getUserId } from "./utils/userHelper";
import Index from "./pages/Index";
import Profiles from "./pages/Profiles";
import SwitchUser from "./pages/SwitchUser";

class App extends Component {
  public async componentDidMount() {
    try {
      const id = getUserId();
      const userResponse = await fetch(`/users/${id}`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const user = await userResponse.json();

      if (!user) {
        throw new Error("No user");
      }
    } catch (error) {
      // if there is no user, put one in localstorage
      const userResponse = await fetch(`/users`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const users = await userResponse.json();
      if (users && users.length > 0) {
        setUserId(users[0]._id);
        window.location.reload();
      }
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/profiles">
            <Profiles />
          </Route>
          <Route path="/switchUser">
            <SwitchUser />
          </Route>
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
