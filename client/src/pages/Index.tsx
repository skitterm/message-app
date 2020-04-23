import React, { Component } from "react";
import styled from "styled-components";
import { injectUserContext, UserContextProps } from "../context/UserContext";
import MainTabPanel from "../components/MainTabPanel";
import Tab from "../components/Tab";
import PageWrapper from "./PageWrapper";

interface State {
  rooms: any[];
  selectedRoomId: string;
}

export interface Props extends UserContextProps {}
const Content = styled.div`
  display: flex;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rooms: [],
      selectedRoomId: "",
    };
  }

  async componentDidMount() {
    await this.fetchRooms();
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.userId !== this.props.userId) {
      await this.fetchRooms();
    }
  }

  public render() {
    return (
      <PageWrapper title="Messaging App">
        <Content>
          <List>
            {this.state.rooms.map((room) => {
              return (
                <Tab
                  key={room._id}
                  id={room._id}
                  isSelected={room._id === this.state.selectedRoomId}
                  onClick={this.onTabClicked}
                >
                  {room.memberInfo.map((memberInfo: any, index: number) => {
                    return `${index > 0 ? "," : ""}${memberInfo.name.first}`;
                  })}
                </Tab>
              );
            })}
          </List>
          {this.state.selectedRoomId && (
            <MainTabPanel
              roomId={this.state.selectedRoomId}
              userId={this.props.userId}
            />
          )}
        </Content>
      </PageWrapper>
    );
  }

  private onTabClicked = (roomId: string) => {
    this.setState({
      selectedRoomId: roomId,
    });
  };

  private fetchRooms = async () => {
    const userId = this.props.userId;
    const roomsResponse = await fetch(`/users/${userId}/rooms`);
    const roomsJson = await roomsResponse.json();
    if (roomsJson && roomsJson.length > 0) {
      this.setState({ rooms: roomsJson, selectedRoomId: roomsJson[0]._id });
    }
  };
}

export default injectUserContext(Index);
