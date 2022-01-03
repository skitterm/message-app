import React from "react";
import styled from "styled-components";
import { User } from "../../types";
import Button from "../Button";
import Avatar from "../Avatar";


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


interface Props {
  users: User[];
  onItemClick: (user: User) => void;
  itemButtonLabel: string;
}

class UsersList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <ul>
        {this.props.users.map((user) => {
          return (
            <ListItem key={user._id}>
              <Avatar thumbnail={user.thumbnail} size="medium" />
              <Details>
                <ItemTitle>
                  {user.name.first} {user.name.last}
                </ItemTitle>
                <Button onClick={this.props.onItemClick.bind(this, user)}>
                  {this.props.itemButtonLabel}
                </Button>
              </Details>
            </ListItem>
          );
        })}
      </ul>
    );
  }
}

export default UsersList;