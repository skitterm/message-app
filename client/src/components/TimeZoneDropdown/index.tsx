import React, { Component, FormEvent } from "react";
import timezones from "timezones.json";
import styled from "styled-components";
import variables from "../../styles/variables";

const StyledSelect = styled.select`
  font-size: ${variables.fontSize.md};
  padding: 0.5rem 1rem;
`;

interface Props {
  value: string;
  onChange: (timeZone: string) => void;
}

class TimeZoneDropdown extends Component<Props> {
  public render() {
    return (
      <StyledSelect
        name="timezones"
        onChange={this.onInput}
        value={this.props.value}
      >
        {timezones.map((timezone) => {
          return (
            <option key={timezone.text} value={timezone.text}>
              {timezone.value}
            </option>
          );
        })}
      </StyledSelect>
    );
  }

  private onInput = (event: FormEvent<HTMLSelectElement>) => {
    this.props.onChange(event.currentTarget.value);
  };
}

export default TimeZoneDropdown;
