import React, { Component, ChangeEvent, KeyboardEvent } from "react";
import styled from "styled-components";
import variables from "../../styles/variables";

export interface Props {
  value: string;
  fontSize?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onEnterPressed?: (value: string) => void;
}

const Input = styled.input<{ fontSize: string }>`
  font-size: ${(props) => props.fontSize};
  padding: 0.5em 1em;
`;

class TextInput extends Component<Props> {
  public render() {
    return (
      <Input
        type="text"
        fontSize={this.props.fontSize || variables.fontSize.md}
        value={this.props.value}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        placeholder={this.props.placeholder}
      />
    );
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      this.props.onChange(event.target.value);
    }
  };

  private onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      typeof this.props.onEnterPressed === "function"
    ) {
      // @ts-ignore
      this.props.onEnterPressed(event.target.value);
    }
  };
}

export default TextInput;
