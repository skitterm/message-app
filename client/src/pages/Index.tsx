import React, { Component } from "react";
import styled from "styled-components";
import config from "../config";
import PageWrapper from "./PageWrapper";

const StyledButton = styled.button`
  padding: 0;
  border: 0;
  box-shadow: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  height: 50px;
`;

const StyledImage = styled.img`
  height: 100%;
`;

interface Props {}

class Index extends Component<Props> {
  public componentDidMount() {
    // @ts-ignore -- .gapi does exist
    const googleAPI = window.gapi;
    googleAPI.load("auth2", async () => {
      const GoogleAuth = await googleAPI.auth2.init({
        client_id: config.googleClientId,
        cookiepolicy: "single-host-origin",
      });

      console.log("is signed in:", GoogleAuth.isSignedIn.get());
    });
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        <h3>Hello there</h3>
        <div className="g-signin2"></div>
        <StyledButton>
          <StyledImage
            src="/google-sign-in-dark.png"
            alt="Sign in with Google"
          />
        </StyledButton>
      </PageWrapper>
    );
  }
}

export default Index;
