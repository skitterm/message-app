import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { User } from "./types";
import config from "./config";
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

    this.state = { isGoogleAPILoaded: false };

    // @ts-ignore -- .gapi does exist
    this.googleAPI = window.gapi;
  }

  public componentDidMount() {
    this.googleAPI.load("auth2", async () => {
      const GoogleAuth = await this.googleAPI.auth2.init({
        client_id: config.googleClientId,
        cookiepolicy: "single-host-origin",
      });

      console.log("is signed in: ", GoogleAuth.isSignedIn.get());
      this.setState({
        isGoogleAPILoaded: true,
      });
    });
  }

  public render() {
    const isAuthed = false;

    return (
      <UserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route
              path="/messages"
              render={({ location }) => {
                return !isAuthed ? (
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
                return !isAuthed ? (
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
                return !isAuthed ? (
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
                return isAuthed ? (
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
