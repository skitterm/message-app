import React, { Component } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import PageWrapper from "./PageWrapper";

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 16px;
`;

interface State {
  allUsers: any[];
}

interface Props {}

class Users extends Component<Props, State> {
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
      <PageWrapper title="Connect with other users">
        <ul>
          {this.state.allUsers.map((user) => {
            return (
              <ListItem key={user._id}>
                <Avatar thumbnail={user.thumbnail} size="large" />
                <Details>
                  <h3>
                    {user.name.first} {user.name.last}
                  </h3>
                  <Button>Start messaging</Button>
                </Details>
              </ListItem>
            );
          })}
        </ul>
      </PageWrapper>
    );
  }

  private getAllUsers = async () => {
    const usersRequest = await fetch("/users");
    const users = await usersRequest.json();
    this.setState({
      allUsers: users,
    });
  };
}

export default Users;
