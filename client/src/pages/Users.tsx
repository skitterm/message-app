import React, { Component } from "react";
import styled from "styled-components";
import { injectUserContext, UserContextProps } from "../context/UserContext";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import PageWrapper from "./PageWrapper";

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

interface Props extends UserContextProps {}

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
                <Avatar thumbnail={user.thumbnail} size="medium" />
                <Details>
                  <ItemTitle>
                    {user.name.first} {user.name.last}
                  </ItemTitle>
                  <Button onClick={this.onUserClick.bind(this, user._id)}>
                    Message
                  </Button>
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

  private onUserClick = (userId: string) => {
    if (this.props.user) {
      //
    }
    // let the database know that there is a new room for person
  };
}

export default injectUserContext(Users);
