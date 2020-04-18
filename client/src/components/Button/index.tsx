import React, { Component } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";

const StyledButton = styled.button<Props>`
  background-color: ${(props) =>
    props.mode === "clear" ? "transparent" : variables.color.accent};
  color: ${(props) =>
    props.mode === "clear" ? variables.color.danger : variables.color.white};
  font-size: ${variables.fontSize.md};
  padding: 0.5em 1em;
  box-shadow: 0px 0px 3px 1px #888;
  border-radius: 2px;
  border: ${(props) =>
    props.mode === "clear" ? `2px solid ${variables.color.danger}` : "none"};
  cursor: pointer;

  &:active {
    box-shadow: inset 0 0 5px -1px #000, 0 0 3px 1px #888;
  }

  &:disabled {
    opacity: 0.7;
    filter: grayscale(0.5);
    cursor: initial;
  }
`;

interface Props {
  onClick: () => void;
  mode?: "default" | "clear";
  isDisabled?: boolean;
}

class Button extends Component<Props> {
  public static defaultProps: Partial<Props> = {
    mode: "default",
  };

  public render() {
    return (
      <StyledButton
        onClick={this.props.onClick}
        disabled={this.props.isDisabled}
        mode={this.props.mode}
      >
        {this.props.children}
      </StyledButton>
    );
  }
}

export default Button;
