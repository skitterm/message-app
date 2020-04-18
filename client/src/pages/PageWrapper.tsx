import React, { Component } from "react";
import Header from "../components/Header";
import ContentContainer from "../components/ContentContainer";
import Title from "../components/Title";

interface Props {
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
              path: `/profiles/${window.localStorage.getItem("userId") || ""}`,
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

export default PageWrapper;
