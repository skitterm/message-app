import React, { Component } from "react";
import Message from "./Message";
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
    );
  }
}

export default App;
