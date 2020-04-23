import React, { Component } from "react";
import { injectUserContext, UserContextProps } from "../context/UserContext";
import Header from "../components/Header";
import ContentContainer from "../components/ContentContainer";
import Title from "../components/Title";

interface Props extends UserContextProps {
  title: string;
}

class PageWrapper extends Component<Props> {
  public render() {
    return (
      <>
        <Header
          links={[
            {
              path: "/",
              label: "Home",
            },
            {
              path: `/profiles/${this.props.user?._id || ""}`,
              label: "Profile",
            },
            {
              path: "/switchUser",
              label: "Switch User",
            },
          ]}
        />
        <ContentContainer>
          <Title>{this.props.title}</Title>
          {this.props.children}
        </ContentContainer>
      </>
    );
  }
}

export default injectUserContext(PageWrapper);
