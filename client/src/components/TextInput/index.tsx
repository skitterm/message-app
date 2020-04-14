import React, { Component, ChangeEvent } from "react";
import styled from "styled-components";

export interface Props {
  value: string;
  fontSize?: string;
  placeholder?: string;
  onChange: (value: string) => void;
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
        fontSize={this.props.fontSize || "14px"}
        value={this.props.value}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
      />
    );
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      this.props.onChange(event.target.value);
    }
  };
}

export default TextInput;
