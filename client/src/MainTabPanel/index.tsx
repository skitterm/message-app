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
      messages: [],
    };
  }

  public async componentDidMount() {
    await this.fetchMessages();
  }

  public async componentDidUpdate(prevProps: Props) {
    if (this.props.roomId !== prevProps.roomId) {
      await this.fetchMessages();
    }
  }

  public render() {
    const styles = {
      list: {
        listStyleType: "none",
      },
    };

    return (
      <ul style={styles.list}>
        {this.state.messages.map((message) => {
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

  private fetchMessages = async () => {
    const messagesResponse = await fetch(
      `/rooms/${this.props.roomId}/messages`
    );
    const messageJson = await messagesResponse.json();
    this.setState({ messages: messageJson });
  };
}

export default MainTabPanel;
