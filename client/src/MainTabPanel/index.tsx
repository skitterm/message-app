import React, { Component } from "react";
import Message from "../Message";

interface State {
  messages: any[];
}

export interface Props {
  roomId: string;
}

class MainTabPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  public async componentDidMount() {
    const messagesResponse = await fetch(`/messages/${this.props.roomId}`);
    const messageJson = await messagesResponse.json();
    this.setState({ messages: messageJson });
  }

  public render() {
    const styles = {
      list: {
        listStyleType: "none"
      }
    };

    return (
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
    );
  }
}

export default MainTabPanel;
