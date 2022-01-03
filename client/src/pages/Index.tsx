import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import Button from "../components/Button";
import UsersList from "../components/UsersList";
import { User } from "../types";
import PageWrapper from "./PageWrapper";

interface Props extends RouteComponentProps {
  onUserSelected: (user: User) => void;
}
interface State {
  isLoading: boolean;
  potentialUsers: User[];
  potentialChatmates: User[];
  chosenUser?: User;
  chosenChatmate?: User;
  step: "initial" | "choose-user" | "choose-chatmate" | "final";
}

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      potentialUsers: [],
      potentialChatmates: [],
      step: "initial",
    };
  }

  public async componentDidMount() {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");
    if (userId) {
      const userResponse = await fetch("/users");
      const users = (await userResponse.json()) as User[];
      const user = users.find((item) => {
        return item._id === userId;
      });
      if (user) {
        this.props.onUserSelected(user);
        this.props.history.push("/messages");
      }
    }
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        {this.renderTitle()}
        {this.state.step === "final" ? (
          <Button onClick={this.beginChat.bind(this)}>Launch</Button>
        ) : this.state.step === "choose-chatmate" ? (
          <UsersList
            users={this.state.potentialChatmates}
            onItemClick={this.onChatmateSelected.bind(this)}
            itemButtonLabel="Choose"
          />
        ) : this.state.step === "choose-user" &&
          this.state.potentialUsers.length ? (
          <UsersList
            users={this.state.potentialUsers}
            onItemClick={this.onUserSelected.bind(this)}
            itemButtonLabel="Choose"
          />
        ) : (
          <Button
            onClick={() => {
              this.startDemo();
            }}
          >
            Start demo
          </Button>
        )}
      </PageWrapper>
    );
  }

  private onChatmateSelected(chatmate: User) {
    this.setState({
      chosenChatmate: chatmate,
      step: "final",
    });
  }

  private async beginChat() {
    if (!this.state.chosenChatmate) {
      return;
    }

    const url =
      window.location.origin + "?userId=" + this.state.chosenChatmate._id;
    window.open(url, "_blank", "noopener");

    if (this.state.chosenUser) {
      await fetch(`/users/${this.state.chosenUser._id}/rooms`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ memberId: this.state.chosenChatmate._id }),
      });

      this.props.onUserSelected(this.state.chosenUser);
      this.props.history.push("/messages");
    }
  }

  private async onUserSelected(user: User) {
    this.setState({
      chosenUser: user,
      step: "choose-chatmate",
    });

    const response = await fetch("/users");
    const chatmates = ((await response.json()) as User[]).filter(
      (item) => item._id !== this.state.chosenUser?._id
    );

    this.setState({
      potentialChatmates: chatmates,
    });
  }

  private async startDemo() {
    this.setState({
      isLoading: true,
      step: "choose-user",
    });

    const response = await fetch("/demo");
    this.setState({
      potentialUsers: (await response.json()) as User[],
      isLoading: false,
    });
  }

  private renderTitle() {
    let message = "";
    switch (this.state.step) {
      case "initial":
        message =
          "Welcome to Demo Mode, click to get started";
        break;
      case "choose-user":
        message = "Choose a user";
        break;
      case "choose-chatmate":
        message = "Choose a person to chat with";
        break;
      case "final":
        message =
          "Your users are all set up! Click Launch to start a chat between the two users. Each user will display in their own tab.";
        break;
      default:
        message = "";
        break;
    }
    return <h2>{message}</h2>;
  }
}

export default withRouter(Index);
