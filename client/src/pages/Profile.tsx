import React, { Component } from "react";
import ContentContainer from "../components/ContentContainer";
import Header from "../components/Header";
import Title from "../components/Title";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import TimeZoneDropdown from "../components/TimeZoneDropdown";

interface State {
  firstName: string;
  lastName: string;
  timeZone: string;
}

class Profile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      timeZone: "",
    };
  }

  public async componentDidMount() {
    const id = this.getProfileId();

    try {
      const userResponse = await fetch(`/users/${id}`);
      if (userResponse.status !== 200) {
        throw new Error(userResponse.statusText);
      }
      const user = await userResponse.json();
      if (user && user.name) {
        this.setState({
          firstName: user.name.first,
          lastName: user.name.last,
          timeZone: user.timeZone,
        });
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
          />
          <TextInput
            value={this.state.lastName}
            placeholder="Last name"
            onChange={this.onLastNameChange}
          />
          <Button onClick={this.onSaveClick}>Save</Button>
          <TimeZoneDropdown
            onChange={this.onTimeZoneChange}
            value={this.state.timeZone}
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

  private onTimeZoneChange = (timeZone: string) => {
    this.setState({
      timeZone,
    });
  };

  private onSaveClick = async () => {
    const id = this.getProfileId();
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      timeZone: this.state.timeZone,
    };

    const userResponse = await fetch(`/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (userResponse.status !== 200) {
      throw new Error(userResponse.statusText);
    }
  };

  private getProfileId = (): string => {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
  };
}

export default Profile;
