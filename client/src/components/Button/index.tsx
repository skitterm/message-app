import React, { Component } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";

const StyledButton = styled.button`
  background-color: ${variables.color.accent};
  color: white;
  font-size: ${variables.fontSize.md};
`;

interface Props {
  onClick: () => void;
}

class Button extends Component<Props> {
  public render() {
    return (
      <StyledButton onClick={this.props.onClick}>
        {this.props.children}
      </StyledButton>
    );
  }
}

export default Button;
