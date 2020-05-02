import React, { Component } from "react";
import config from "../config";
import PageWrapper from "./PageWrapper";

interface Props {}

class Index extends Component<Props> {
  public componentDidMount() {
    // @ts-ignore -- .gapi does exist
    const googleAPI = window.gapi;
    googleAPI.load("auth2", () => {
      googleAPI.auth2
        .init({
          client_id: config.googleClientId,
          cookiepolicy: "single-host-origin",
        })
        .then((GoogleAuth: any) => {
          console.log("is signed in:", GoogleAuth.isSignedIn.get());
        });
    });
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        <h3>Hello there</h3>
        <div className="g-signin2"></div>
      </PageWrapper>
    );
  }

  private onSignIn = (googleUser: any) => {
    console.log(`user ${googleUser.getBasicProfile().getName()} signed in`);
  };
}

export default Index;
