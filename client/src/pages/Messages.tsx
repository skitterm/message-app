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

interface UserSocket {
  userId: string;
  client: WebSocket;
  isActive: boolean;
}

interface State {
  rooms: ClientRoom[];
  selectedRoomId: string;
  userSockets: UserSocket[];
}

export interface Props extends UserContextProps {}

class Messages extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rooms: [],
      selectedRoomId: "",
      userSockets: [],
    };
  }

  async componentDidMount() {
    // @ts-ignore -- .gapi does exist
    const googleAPI = window.gapi;
    googleAPI.load("auth2", () => {
      googleAPI.auth2
        .init({
          client_id: config.googleClientId,
          cookiepolicy: "single-host-origin",
        })
        .then((GoogleAuth: any) => {
          console.log("is signed in:", GoogleAuth.isSignedIn.get());
        });
    });

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
        <div className="g-signin2"></div>
        <Content>
          <List>
            {this.state.rooms.map((clientRoom: ClientRoom, index) => {
              const otherRoomUser = clientRoom.room.memberInfo.filter(
                (memberInfo: any) => {
                  return memberInfo._id !== this.props.user?._id;
                }
              )[0];
              if (!otherRoomUser) {
                return null;
              }

              const otherUserSocket = this.state.userSockets.find(
                (userSocket) => userSocket.userId === otherRoomUser._id
              );

              return (
                <Tab
                  key={clientRoom.room._id}
                  id={clientRoom.room._id}
                  isSelected={clientRoom.room._id === this.state.selectedRoomId}
                  onClick={this.onTabClicked}
                  shouldShowAlert={clientRoom.hasUnreadMessage}
                  isAlive={otherUserSocket ? otherUserSocket.isActive : false}
                >
                  {otherRoomUser &&
                    `${otherRoomUser.name.first} ${otherRoomUser.name.last}`}
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

  private onSignIn = (googleUser: any) => {
    console.log(`user ${googleUser.getBasicProfile().getName()} signed in`);
  };

  private onTabClicked = (roomId: string) => {
    this.setState({
      selectedRoomId: roomId,
    });
  };

  private fetchRooms = async () => {
    if (this.props.user) {
      this.initUserWebSocket(this.props.user._id);

      const userId = this.props.user._id;
      const roomsResponse = await fetch(`/users/${userId}/rooms`);
      const roomsJson = await roomsResponse.json();
      if (roomsJson && roomsJson.length > 0) {
        const allUsers = this.getAllConnectedUsers(roomsJson);

        await this.setState({
          rooms: roomsJson.map((room: any) => {
            return {
              client: this.initRoomWebSocket(room._id),
              room,
              hasUnreadMessage: false,
            };
          }),
          selectedRoomId: roomsJson[0]._id,
          userSockets: allUsers.map((userId: string) => {
            return {
              userId,
              client: this.initUserWebSocket(userId),
              isActive: false,
            };
          }),
        });
      }
    }
  };

  private getAllConnectedUsers = (rooms: any[]) => {
    if (!this.props.user) {
      return [];
    }
    const users: string[] = [];
    rooms.forEach((room: any) => {
      room.memberInfo.forEach((infoItem: any) => {
        if (infoItem._id !== this.props.user?._id) {
          users.push(infoItem._id);
        }
      });
    });

    return users;
  };

  private initRoomWebSocket = (roomId: string) => {
    if (!roomId) {
      return;
    }
    const socket = new WebSocket(config.webSocketUrl);
    socket.addEventListener("open", () => {
      this.sendSocketData(socket, "room", {
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

  private initUserWebSocket = (userId: string) => {
    const socket = new WebSocket(config.webSocketUrl);
    socket.addEventListener("open", () => {
      this.sendSocketData(socket, "user", {
        type: "register",
        data: { id: userId, isCurrentUser: userId === this.props.user?._id },
      });
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.id !== this.props.user?._id) {
        const userSockets = this.state.userSockets.slice(0);
        const userSocketIndex = userSockets.findIndex(
          (socketItem) => socketItem.client === socket
        );

        if (userSocketIndex === -1) {
          return;
        }

        const userSocket = userSockets[userSocketIndex];
        const updatedSocket = Object.assign({}, userSocket, {
          isActive: data.isActive,
        });
        userSockets.splice(userSocketIndex, 1, updatedSocket);
        this.setState({
          userSockets: userSockets,
        });
      }
    });

    return socket;
  };

  private sendSocketData = (
    socket: WebSocket,
    clientType: string,
    data: any
  ) => {
    socket.send(JSON.stringify({ ...data, clientType }));
  };
}

export default injectUserContext(Messages);
