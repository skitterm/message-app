import React, { Component } from "react";
import styled from "styled-components";
import config from "../config";
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

interface Props {}

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
        <h3>Hello there</h3>
        <StyledButton id="sign-in-button" />
      </PageWrapper>
    );
  }

  private onSignInSuccess = async (googleUser: any) => {
    const idToken = googleUser.getAuthResponse().id_token;

    await fetch("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
  };
}

export default Index;
