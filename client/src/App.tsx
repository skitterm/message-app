import React, { Component } from "react";
import "./App.css";

interface State {
  messages: any[];
}

interface Props {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    fetch("/messages").then(response => {
      response.json().then(items => {
        this.setState({ messages: items });
      });
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Messaging App</h1>
        <ul
          style={{
            listStyleType: "none"
          }}
        >
          {this.state.messages.map(message => {
            const fullName = `${message.user.name.first} ${message.user.name.last}`;
            return (
              <li
                key={message.message._id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "20px"
                }}
              >
                <img
                  src={`/temp_images/${message.user.profileImageUrl}`}
                  alt={`Thumbnail for ${fullName}`}
                  style={{
                    width: "50px",
                    height: "auto",
                    paddingRight: "10px"
                  }}
                />
                <div>
                  <h4
                    style={{
                      margin: "0 0 4px"
                    }}
                  >
                    {fullName}
                  </h4>
                  <p
                    style={{
                      marginTop: "0"
                    }}
                  >
                    Message: {message.message.contents}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
