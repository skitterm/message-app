import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Index from "./pages/Index";
import Profiles from "./pages/Profiles";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/profiles">
            <Profiles />
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
