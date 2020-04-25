import React, { Component, RefObject, createRef } from "react";
import styled from "styled-components";
import { User, Message as IMessage } from "../../types";
import { injectUserContext, UserContextProps } from "../../context/UserContext";
import Message from "../Message";
import TextInput from "../TextInput";
import Button from "../Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  flex: 1 1 auto;
  height: 70vh;
  padding-bottom: 45px;
`;

const List = styled.ul`
  height: 200px;
  overflow: auto;
  list-style-type: none;
  padding-left: 0;
  flex: 1 1 auto;
`;

const Actions = styled.div`
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 12px;
  max-width: 70vw;
`;

interface UserMessage {
  user: User;
  message: IMessage;
}

interface State {
  messages: UserMessage[];
  text: string;
}

interface SocketData {
  type: "register" | "message";
  data: any;
}

export interface Props extends UserContextProps {
  roomId: string;
}

class MainTabPanel extends Component<Props, State> {
  // @ts-ignore
  private socket: WebSocket;
  private listRef: RefObject<HTMLUListElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
      text: "",
    };

    this.listRef = createRef();
    this.createSocket();
  }

  public async componentDidMount() {
    await this.fetchMessages();
    this.scrollToBottom();
  }

  public async componentDidUpdate(prevProps: Props) {
    if (this.props.roomId !== prevProps.roomId) {
      this.closeSocket();
      this.createSocket();

      await this.fetchMessages();
      this.scrollToBottom();
    }
  }

  public render() {
    return (
      <Container>
        <List ref={this.listRef}>
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
          <TextInput
            value={this.state.text}
            onChange={this.onTextChanged}
            onEnterPressed={this.onSendClicked}
          />
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

    if (!this.props.user) {
      return;
    }

    const data = {
      sender: this.props.user._id,
      roomId: this.props.roomId,
      contents: message,
      timeSent: Date.now(),
    };

    this.sendSocketData({
      type: "message",
      data: {
        user: this.props.user,
        message: {
          ...data,
          room: this.props.roomId,
          _id: "",
        },
      },
    });

    await fetch(`/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  private sendSocketData = (data: SocketData) => {
    this.socket.send(JSON.stringify(data));
  };

  private createSocket = () => {
    this.socket = new WebSocket("ws://localhost:3002");

    this.socket.addEventListener("open", () => {
      if (this.props.user) {
        this.sendSocketData({
          type: "register",
          data: { room: this.props.roomId },
        });
      }
    });

    this.socket.addEventListener("message", (event) => {
      const messages = this.state.messages.slice(0);
      messages.push(JSON.parse(event.data));
      this.setState({
        messages,
      });

      this.scrollToBottom();
    });
  };

  private closeSocket = () => {
    this.socket.close();
  };

  private scrollToBottom = () => {
    if (this.listRef.current) {
      this.listRef.current.scroll(0, 3000);
    }
  };
}

export default injectUserContext(MainTabPanel);
