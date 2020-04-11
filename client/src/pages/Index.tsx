import React, { Component } from "react";
import styled from "styled-components";
import Header from "../Header";
import MainTabPanel from "../MainTabPanel";
import Tab from "../SideTabBar/Tab";

interface State {
  rooms: any[];
  selectedRoomId: string;
}

export interface Props {}

const App = styled.div`
  margin: auto;
  width: 800px;
`;

const Title = styled.h1`
  text-align: center;
`;

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
    const roomsResponse = await fetch("/rooms");
    const roomsJson = await roomsResponse.json();
    if (roomsJson && roomsJson.length > 0) {
      this.setState({ rooms: roomsJson, selectedRoomId: roomsJson[0]._id });
    }
  }

  public render() {
    return (
      <App>
        <Header path="/profile" label="Profile" />
        <Title>Messaging App</Title>
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
            <MainTabPanel roomId={this.state.selectedRoomId} />
          )}
        </Content>
      </App>
    );
  }

  private onTabClicked = (roomId: string) => {
    this.setState({
      selectedRoomId: roomId,
    });
  };
}

export default Index;
