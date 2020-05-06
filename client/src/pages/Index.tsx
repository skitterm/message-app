import React, { Component } from "react";
import styled from "styled-components";
import { User } from "../types";
import PageWrapper from "./PageWrapper";

const StyledButton = styled.button`
  border: none;
  box-shadow: none;
  padding: 0;
  background-color: transparent;
`;

interface Props {
  onUserAuthenticated: (user: User) => void;
  googleAPI?: any;
}

class Index extends Component<Props> {
  public componentDidMount() {
    if (this.props.googleAPI) {
      this.renderSignInButton();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.googleAPI && this.props.googleAPI) {
      this.renderSignInButton();
    }
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        <StyledButton id="sign-in-button" />
      </PageWrapper>
    );
  }

  private renderSignInButton = () => {
    this.props.googleAPI.signin2.render("sign-in-button", {
      height: 50,
      width: "auto",
      theme: "dark",
      longTitle: true,
      onSuccess: this.onSignInSuccess,
    });
  };

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: json.id,
          firstName: json.firstName,
          lastName: json.lastName,
        }),
      });
    }

    const userResponse = await fetch(`/users/${json.id}`, {
      method: "GET",
    });

    const userJson = await userResponse.json();
    this.props.onUserAuthenticated(userJson);
  };
}

export default Index;
