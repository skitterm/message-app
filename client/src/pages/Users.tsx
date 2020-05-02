import React, { Component } from "react";
import PageWrapper from "./PageWrapper";

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
              <li key={user._id}>
                {user.name.first} {user.name.last}
              </li>
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
