import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { setUserId, getUserId } from "./utils/userHelper";
import UserContext from "./context/UserContext";
import Index from "./pages/Index";
import Profiles from "./pages/Profiles";
import SwitchUser from "./pages/SwitchUser";

interface State {
  userId: string;
  updateUserId: (userId: string) => void;
}

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      userId: "",
      updateUserId: this.updateUserId,
    };
  }

  public async componentDidMount() {
    try {
      const id = getUserId();
      if (!id) {
        throw new Error("No user found");
      }
      const userResponse = await fetch(`/users/${id}`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const user = await userResponse.json();

      if (!user) {
        throw new Error("No user");
      }

      this.updateUserId(id);
    } catch (error) {
      // if there is no user, put one in localstorage
      const userResponse = await fetch(`/users`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const users = await userResponse.json();
      if (users && users.length > 0) {
        this.updateUserId(users[0]._id);
        window.location.reload();
      }
    }
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
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
      </UserContext.Provider>
    );
  }

  private updateUserId = (userId: string) => {
    this.setState({ userId });
    setUserId(userId);
  };
}

export default App;
