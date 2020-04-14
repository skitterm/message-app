import React, { Component } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";

export interface Props {
  id: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const Button = styled.button<{ isSelected: boolean }>`
  display: block;
  width: 100%;
  text-align: start;
  padding: 5px 15px;
  border: none;
  border-left: 3px solid transparent;
  border-left-color: ${(props) =>
    props.isSelected ? variables.color.accent : "transparent"};
  margin-bottom: 5px;
`;

class Tab extends Component<Props> {
  public render() {
    return (
      <li>
        <Button onClick={this.onClick} isSelected={this.props.isSelected}>
          {this.props.children}
        </Button>
      </li>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.id);
  };
}

export default Tab;