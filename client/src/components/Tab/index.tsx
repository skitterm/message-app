import React, { Component } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";
import Alert from "../Alert";

export interface Props {
  id: string;
  isSelected: boolean;
  isAlive: boolean;
  onClick: (id: string) => void;
  shouldShowAlert: boolean;
}

const ListItem = styled.li`
  position: relative;
`;

const Button = styled.button<{ isSelected: boolean; isAlive: boolean }>`
  display: block;
  width: 100%;
  text-align: start;
  padding: 5px 15px;
  border: none;
  border-left: 3px solid transparent;
  border-left-color: ${(props) =>
    props.isSelected ? variables.color.accent : "transparent"};
  margin-bottom: 5px;
  border-right-width: 3px;
  border-right-style: solid;
  border-right-color: ${(props) =>
    props.isAlive ? variables.color.success : `${variables.color.success}40`};
  font-size: ${variables.fontSize.sm};
`;

class Tab extends Component<Props> {
  public render() {
    return (
      <ListItem>
        {this.props.shouldShowAlert && <Alert size="small" />}
        <Button
          onClick={this.onClick}
          isSelected={this.props.isSelected}
          isAlive={this.props.isAlive}
        >
          {this.props.children}
        </Button>
      </ListItem>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.id);
  };
}

export default Tab;
