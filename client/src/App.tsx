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
        <ul>
          {this.state.messages.map(message => {
            return (
              <li key={message.message._id}>
                <h4>
                  Sender: {message.user.name.first} {message.user.name.last}
                </h4>
                <p>Message: {message.message.contents}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
