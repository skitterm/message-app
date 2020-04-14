import React, { Component } from "react";
import ContentContainer from "../components/ContentContainer";
import Header from "../components/Header";
import Title from "../components/Title";
import TextInput from "../components/TextInput";

interface State {
  name: string;
}

class Profile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: "",
    };
  }

  public render() {
    return (
      <>
        <Header path="/" label="Home" />
        <ContentContainer>
          <Title>Profile</Title>
          <TextInput
            value={this.state.name}
            placeholder="Your full name"
            onChange={this.onNameChange}
            fontSize="18px"
          />
        </ContentContainer>
      </>
    );
  }

  private onNameChange = (value: string) => {
    this.setState({
      name: value,
    });
  };
}

export default Profile;
