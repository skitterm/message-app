import React, { Component } from "react";
import ContentContainer from "../components/ContentContainer";
import Header from "../Header";

class Profile extends Component {
  public render() {
    return (
      <ContentContainer>
        <Header path="/" label="Home" />
        <h1>Profile</h1>
      </ContentContainer>
    );
  }
}

export default Profile;
