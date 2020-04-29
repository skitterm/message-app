import React, { Component } from "react";
import styled from "styled-components";
import config from "../config";
import { injectUserContext, UserContextProps } from "../context/UserContext";
import MainTabPanel from "../components/MainTabPanel";
import Tab from "../components/Tab";
import PageWrapper from "./PageWrapper";

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

interface ClientRoom {
  client: WebSocket;
  room: any;
  hasUnreadMessage: boolean;
}

interface State {
  rooms: ClientRoom[];
  selectedRoomId: string;
}

export interface Props extends UserContextProps {}

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
    if (prevProps.user?._id !== this.props.user?._id) {
      await this.fetchRooms();
    }
  }

  public render() {
    return (
      <PageWrapper title="Messaging App">
        <Content>
          <List>
            {this.state.rooms.map((clientRoom: ClientRoom, index) => {
              return (
                <Tab
                  key={clientRoom.room._id}
                  id={clientRoom.room._id}
                  isSelected={clientRoom.room._id === this.state.selectedRoomId}
                  onClick={this.onTabClicked}
                  shouldShowAlert={clientRoom.hasUnreadMessage}
                  isAlive={index === 0}
                >
                  {clientRoom.room.memberInfo
                    .filter((memberInfo: any) => {
                      return memberInfo._id !== this.props.user?._id;
                    })
                    .map((memberInfo: any, index: number) => {
                      return `${index > 0 ? "," : ""}${memberInfo.name.first} ${
                        memberInfo.name.last
                      }`;
                    })}
                </Tab>
              );
            })}
          </List>
          {this.state.selectedRoomId && (
            <MainTabPanel roomId={this.state.selectedRoomId} />
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
    if (this.props.user) {
      const userId = this.props.user._id;
      const roomsResponse = await fetch(`/users/${userId}/rooms`);
      const roomsJson = await roomsResponse.json();
      if (roomsJson && roomsJson.length > 0) {
        await this.setState({
          rooms: roomsJson.map((room: any) => {
            return {
              client: this.initWebSocket(room._id),
              room,
              hasUnreadMessage: false,
            };
          }),
          selectedRoomId: roomsJson[0]._id,
        });
      }
    }
  };

  private initWebSocket = (roomId: string) => {
    if (!roomId) {
      return;
    }
    const socket = new WebSocket(config.webSocketUrl);
    socket.addEventListener("open", () => {
      this.sendSocketData(socket, {
        type: "register",
        data: { id: roomId },
      });
    });

    socket.addEventListener("message", (event) => {
      const clientRoomIndex = this.state.rooms.findIndex(
        (room) => room.client === socket
      );
      if (clientRoomIndex !== -1) {
        const clientRoom = this.state.rooms[clientRoomIndex];
        const newClientRoom = Object.assign({}, clientRoom, {
          hasUnreadMessage: true,
        });
        const newRooms = this.state.rooms.slice(0);
        newRooms.splice(clientRoomIndex, 1, newClientRoom);
        this.setState({
          rooms: newRooms,
        });
      }
    });

    return socket;
  };

  private sendSocketData = (socket: WebSocket, data: any) => {
    socket.send(JSON.stringify({ ...data, clientType: "room" }));
  };
}

export default injectUserContext(Index);
