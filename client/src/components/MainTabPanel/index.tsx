import React, { Component } from "react";
import styled from "styled-components";
import Message from "../Message";
import TextInput from "../TextInput";
import Button from "../Button";

const Container = styled.div`
  margin-left: 32px;
  flex: 1 1 auto;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 12px;
`;

interface State {
  messages: any[];
  text: string;
}

export interface Props {
  userId: string;
  roomId: string;
}

class MainTabPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
      text: "",
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
    return (
      <Container>
        <List>
          {this.state.messages.map((message) => {
            const fullName = `${message.user.name.first} ${message.user.name.last}`;
            return (
              <Message
                key={message.message._id}
                name={fullName}
                time={message.message.timeSent}
                thumbnail={message.user.thumbnail}
                contents={message.message.contents}
              />
            );
          })}
        </List>
        <Actions>
          <TextInput value={this.state.text} onChange={this.onTextChanged} />
          <Button
            onClick={this.onSendClicked}
            isDisabled={this.state.text.length === 0}
          >
            Send
          </Button>
        </Actions>
      </Container>
    );
  }

  private fetchMessages = async () => {
    const messagesResponse = await fetch(
      `/rooms/${this.props.roomId}/messages`
    );
    const messageJson = await messagesResponse.json();
    this.setState({ messages: messageJson });
  };

  private onTextChanged = (text: string) => {
    this.setState({ text });
  };

  private onSendClicked = async () => {
    const message = this.state.text;

    this.setState({
      text: "",
    });

    const data = {
      sender: this.props.userId,
      roomId: this.props.roomId,
      contents: message,
    };

    await fetch(`/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await this.fetchMessages();
  };
}

export default MainTabPanel;
