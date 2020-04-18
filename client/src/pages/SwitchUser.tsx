import React, { Component } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import variables from "../styles/variables";
import PageWrapper from "./PageWrapper";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 32px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledName = styled.h4`
  font-size: ${variables.fontSize.lg};
  margin: 8px 0 16px;
`;

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
    return (
      <PageWrapper title="Switch User">
        <Container>
          {this.state.users.map((user) => {
            const name = `${user.name.first} ${user.name.last}`;

            return (
              <Item>
                <Avatar size="large" thumbnail={user.thumbnail} />
                <StyledName>{name}</StyledName>
                <Button>Select</Button>
              </Item>
            );
          })}
        </Container>
      </PageWrapper>
    );
  }
}

export default SwitchUser;
