import React, { Component } from "react";
import styled from "styled-components";
import config from "../config";
import { User } from '../types';
import PageWrapper from "./PageWrapper";

const StyledButton = styled.button`
  border: none;
  box-shadow: none;
  padding: 0;
  background-color: transparent;
`;

interface State {
  isSignedIn: boolean;
}

interface Props {
  onUserAuthenticated: (user: User) => void;
}

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSignedIn: false,
    };
  }

  public componentDidMount() {
    // @ts-ignore -- .gapi does exist
    const googleAPI = window.gapi;
    googleAPI.load("auth2", async () => {
      const GoogleAuth = await googleAPI.auth2.init({
        client_id: config.googleClientId,
        cookiepolicy: "single-host-origin",
      });

      this.setState({ isSignedIn: GoogleAuth.isSignedIn.get() });

      if (!this.state.isSignedIn) {
        googleAPI.signin2.render("sign-in-button", {
          height: 50,
          width: "auto",
          theme: "dark",
          longTitle: true,
          onSuccess: this.onSignInSuccess,
        });
      }
    });
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        {!this.state.isSignedIn && <StyledButton id="sign-in-button" />}
      </PageWrapper>
    );
  }

  private onSignInSuccess = async (googleUser: any) => {
    const idToken = googleUser.getAuthResponse().id_token;

    const response = await fetch("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    const json = await response.json();

    if (!json.exists) {
      await fetch("/users", {
        method: "PUT",
        body: JSON.stringify({
          id: json.id,
          firstName: json.firstName,
          lastName: json.lastName,
        }),
      });
    }

    const userResponse = await fetch(`/users/${json.id}`);
    const userJson = await userResponse.json();
    this.props.onUserAuthenticated(userJson);

    this.setState({ isSignedIn: true });
  };
}

export default Index;
