import React, { Component } from "react";
import MainTabPanel from "./MainTabPanel";

interface State {
  rooms: any[];
  selectedRoomId: string;
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rooms: [],
      selectedRoomId: ""
    };
  }

  async componentDidMount() {
    const roomsResponse = await fetch("/rooms");
    const roomsJson = await roomsResponse.json();
    if (roomsJson && roomsJson.length > 0) {
      this.setState({ rooms: roomsJson, selectedRoomId: roomsJson[0]._id });
    }
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
                  return (
                    <li key={`${room._id}-${memberInfo._id}`}>
                      {memberInfo.name.first}
                    </li>
                  );
                })}
              </ul>
            );
          })}
          {this.state.selectedRoomId && (
            <MainTabPanel roomId={this.state.selectedRoomId} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
