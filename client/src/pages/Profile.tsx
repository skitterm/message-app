import React, { Component } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import TimeZoneDropdown from "../components/TimeZoneDropdown";
import Avatar from "../components/Avatar";
import variables from "../styles/variables";
import { generateThumbnail } from "../utils/profileHelper";
import PageWrapper from "./PageWrapper";

interface State {
  firstName: string;
  lastName: string;
  timeZone: string;
  thumbnail: string;
}

const StyledLabelTitle = styled.h4`
  margin: 0 0 4px;
  font-size: ${variables.fontSize.md};
`;

const StyledForm = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 32px;
  max-width: 400px;
  margin-bottom: 32px;
`;

const StyledButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 12px;
`;

const Spacer = styled.div`
  margin-bottom: 12px;
`;

class Profile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      timeZone: "",
      thumbnail: "",
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
          thumbnail: user.thumbnail,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    return (
      <PageWrapper title="Profile">
        <StyledForm>
          <label>
            <StyledLabelTitle>Profile picture</StyledLabelTitle>
            <Avatar size="large" thumbnail={this.state.thumbnail} />
            <Spacer />
            <Button onClick={this.onSwitchPictureClick}>Switch picture</Button>
          </label>
          <label>
            <StyledLabelTitle>First name</StyledLabelTitle>
            <TextInput
              value={this.state.firstName}
              placeholder="First name"
              onChange={this.onFirstNameChange}
            />
          </label>
          <label>
            <StyledLabelTitle>Last name</StyledLabelTitle>
            <TextInput
              value={this.state.lastName}
              placeholder="Last name"
              onChange={this.onLastNameChange}
            />
          </label>
          <label>
            <StyledLabelTitle>Time zone</StyledLabelTitle>
            <TimeZoneDropdown
              onChange={this.onTimeZoneChange}
              value={this.state.timeZone}
            />
          </label>
          <StyledButtonContainer>
            <Button onClick={this.onCancelClick} mode="clear">
              Cancel
            </Button>
            <Button onClick={this.onSaveClick}>Save</Button>
          </StyledButtonContainer>
        </StyledForm>
      </PageWrapper>
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

  private onSwitchPictureClick = () => {
    this.setState({
      thumbnail: generateThumbnail(),
    });
  };

  private onSaveClick = async () => {
    const id = this.getProfileId();
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      timeZone: this.state.timeZone,
      thumbnail: this.state.thumbnail,
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

    this.returnToHomePage();
  };

  private onCancelClick = () => {
    this.returnToHomePage();
  };

  private getProfileId = (): string => {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
  };

  private returnToHomePage = () => {
    const url = new URL(window.location.href);
    window.location.href = url.origin;
  };
}

export default Profile;
