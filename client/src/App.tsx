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
              <button
                key={room._id}
                style={styles.list}
                onClick={this.onTabClicked.bind(this, room._id)}
              >
                {room.memberInfo.map((memberInfo: any, index: number) => {
                  return `${index > 0 ? "," : ""}${memberInfo.name.first}`;
                })}
              </button>
            );
          })}
          {this.state.selectedRoomId && (
            <MainTabPanel roomId={this.state.selectedRoomId} />
          )}
        </div>
      </div>
    );
  }

  private onTabClicked = (roomId: string) => {
    this.setState({
      selectedRoomId: roomId
    });
  };
}

export default App;
