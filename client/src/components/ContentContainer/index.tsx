import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: auto;
  width: 800px;
`;

class ContentContainer extends Component {
  public render() {
    return <Container>{this.props.children}</Container>;
  }
}

export default ContentContainer;
