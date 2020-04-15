import React, { Component } from "react";
import ContentContainer from "../components/ContentContainer";
import Header from "../components/Header";
import Title from "../components/Title";
import TextInput from "../components/TextInput";

interface State {
  firstName: string;
  lastName: string;
}

class Profile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
    };
  }

  async componentDidMount() {
    const urlParts = window.location.pathname.split("/");
    const id = urlParts[urlParts.length - 1];

    try {
      const userResponse = await fetch(`/users/${id}`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const user = await userResponse.json();
      if (user && user.name) {
        this.setState({ firstName: user.name.first, lastName: user.name.last });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    return (
      <>
        <Header path="/" label="Home" />
        <ContentContainer>
          <Title>Profile</Title>
          <TextInput
            value={this.state.firstName}
            placeholder="First name"
            onChange={this.onFirstNameChange}
            fontSize="18px"
          />
          <TextInput
            value={this.state.lastName}
            placeholder="Last name"
            onChange={this.onLastNameChange}
            fontSize="18px"
          />
        </ContentContainer>
      </>
    );
  }

  private onFirstNameChange = (value: string) => {
    this.setState({
      firstName: value,
    });
  };

  private onLastNameChange = (value: string) => {
    this.setState({
      lastName: value,
    });
  };
}

export default Profile;
