import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";

class App extends Component {
  render() {
    return (
      <Router>
        <header>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </header>
        <Switch>
          <Route path="/profile">
            <Profile />
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
