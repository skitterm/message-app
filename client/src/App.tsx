import React, { Component } from "react";
import Message from "./Message";

interface State {
  messages: any[];
  rooms: any[];
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
      rooms: []
    };
  }

  async componentDidMount() {
    const roomsResponse = await fetch("/rooms");
    const roomsJson = await roomsResponse.json();
    this.setState({ rooms: roomsJson });

    const messagesResponse = await fetch("/messages");
    const messageJson = await messagesResponse.json();
    this.setState({ messages: messageJson });
  }

  render() {
    const styles = {
      app: {
        margin: "auto",
        width: "800px"
      },
      title: {
        textAlign: "center" as "center"
      },
      content: {
        display: "flex"
      },
      list: {
        listStyleType: "none"
      }
    };

    return (
      <div className="App" style={styles.app}>
        <h1 style={styles.title}>Messaging App</h1>
        <div style={styles.content}>
          {this.state.rooms.map(room => {
            return (
              <ul key={room._id} style={styles.list}>
                {room.memberInfo.map((memberInfo: any) => {
                  const fullName = `${memberInfo.name.first} ${memberInfo.name.last}`;
                  return (
                    <li key={`${room._id}-${memberInfo._id}`}>{fullName}</li>
                  );
                })}
              </ul>
            );
          })}
          <ul style={styles.list}>
            {this.state.messages.map(message => {
              const fullName = `${message.user.name.first} ${message.user.name.last}`;
              return (
                <Message
                  key={message.message._id}
                  name={fullName}
                  time={message.message.timeSent}
                  thumbnail={message.user.profileImageUrl}
                  contents={message.message.contents}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
