import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { User } from "./types";
import UserContext from "./context/UserContext";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Profiles from "./pages/Profiles";
import Users from "./pages/Users";

interface State {
  user?: User;
}

class App extends Component<{}, State> {
  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route path="/messages">
              <Messages />
            </Route>
            <Route path="/profiles">
              <Profiles />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Index onUserAuthenticated={this.onUserSelected} />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    );
  }

  private onUserSelected = (user: User) => {
    this.setState({ user });
  };
}

export default App;
