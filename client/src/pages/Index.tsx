import React, { Component } from "react";
import PageWrapper from "./PageWrapper";

interface Props {}

class Index extends Component<Props> {
  public componentDidMount() {
    //
  }

  public render() {
    return (
      <PageWrapper title="Welcome to the Messaging App">
        <h3>Hello there</h3>
      </PageWrapper>
    );
  }
}

export default Index;
