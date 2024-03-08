import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { injectUserContext, UserContextProps } from "../context/UserContext";
import { User } from "../types";
import PageWrapper from "./PageWrapper";
import UsersList from "../components/UsersList";

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 64px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 16px;
`;

const ItemTitle = styled.h3`
  margin-top: 0;
`;

interface State {
  allUsers: any[];
}

interface Props extends UserContextProps, RouteComponentProps {}

class FindUsers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      allUsers: [],
    };
  }

  public async componentDidMount() {
    await this.getAllUsers();
  }

  public render() {
    return (
      <PageWrapper title="Who would you like to chat with?">
        <UsersList
          users={this.state.allUsers}
          onItemClick={this.onUserClick.bind(this)}
          itemButtonLabel="Message"
        />
      </PageWrapper>
    );
  }

  private getAllUsers = async () => {
    const usersRequest = await fetch("/users");
    const users = await usersRequest.json();

    this.setState({
      allUsers: users.filter((user: User) => user._id !== this.props.user?._id),
    });
  };

  private onUserClick = async (member: User) => {
    const url = window.location.origin + "?userId=" + member._id;
    window.open(url, "_blank", "noopener");

    if (this.props.user) {
      await fetch(`/users/${this.props.user._id}/rooms`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ memberId: member._id }),
      });

      this.props.history.push("/messages");
    }
  };
}

export default withRouter(injectUserContext(FindUsers));
