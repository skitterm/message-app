import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { User } from "./types";
import UserContext from "./context/UserContext";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Profiles from "./pages/Profiles";
import FindUsers from "./pages/FindUsers";

interface State {
  user?: User;
  isGoogleAPILoaded: boolean;
}

interface Props {}

class App extends Component<Props, State> {
  private googleAPI: any;
  constructor(props: Props) {
    super(props);

    this.state = { 
      isGoogleAPILoaded: false, 
    };

    // @ts-ignore -- .gapi does exist
    this.googleAPI = window.gapi;
  }

  public async componentDidMount() {
    const id = '6015aa416131eb0a74e89e52'
    // get the first user... return that for now
    try {
      const userResponse = await fetch(`/users/${id}`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const user = await userResponse.json();
      this.setState({ user });
    } catch(err) {
      console.error('Unable to find user');
    }

    // this.googleAPI.load("auth2", async () => {
    //   await this.googleAPI.auth2.init({
    //     client_id: config.googleClientId,
    //     cookiepolicy: "single-host-origin",
    //   });

    //   this.setState({
    //     isGoogleAPILoaded: true,
    //   });
    // });
  }

  public render() {
    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route
              path="/messages"
              render={({ location }) => {
                return !this.state.user ? (
                  <Redirect
                    to={{
                      pathname: "/",
                      state: { from: location },
                    }}
                  />
                ) : (
                  <Messages />
                );
              }}
            ></Route>
            <Route
              path="/profiles"
              render={({ location }) => {
                return !this.state.user ? (
                  <Redirect
                    to={{
                      pathname: "/",
                      state: { from: location },
                    }}
                  />
                ) : (
                  <Profiles />
                );
              }}
            ></Route>
            <Route
              path="/find-users"
              render={({ location }) => {
                return !this.state.user ? (
                  <Redirect
                    to={{
                      pathname: "/",
                      state: { from: location },
                    }}
                  />
                ) : (
                  <FindUsers />
                );
              }}
            ></Route>
            <Route
              path="/"
              render={({ location }) => {
                return this.state.user ? (
                  <Redirect
                    to={{
                      pathname: "/messages",
                      state: { from: location },
                    }}
                  />
                ) : (
                  <Index
                    onUserAuthenticated={this.onUserSelected}
                    googleAPI={
                      this.state.isGoogleAPILoaded ? this.googleAPI : undefined
                    }
                  />
                );
              }}
            ></Route>
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
