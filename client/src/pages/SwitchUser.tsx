import React, { Component } from "react";
import PageWrapper from "./PageWrapper";

interface State {
  users: any[];
}

class SwitchUser extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      users: [],
    };
  }

  public async componentDidMount() {
    try {
      const usersResponse = await fetch(`/users`);
      if (usersResponse.status !== 200) {
        throw new Error(usersResponse.statusText);
      }
      const users = await usersResponse.json();

      if (users) {
        this.setState({
          users,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public render() {
    return <PageWrapper title="Switch User">Hi</PageWrapper>;
  }
}

export default SwitchUser;
