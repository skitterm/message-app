import React, { Component } from "react";
import ContentContainer from "../components/ContentContainer";
import Header from "../components/Header";
import Title from "../components/Title";

class Profile extends Component {
  public render() {
    return (
      <>
        <Header path="/" label="Home" />
        <ContentContainer>
          <Title>Profile</Title>
        </ContentContainer>
      </>
    );
  }
}

export default Profile;
