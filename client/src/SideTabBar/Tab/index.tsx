import React, { Component } from "react";
import variables from "../../styles/variables";

export interface Props {
  id: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

class Tab extends Component<Props> {
  public render() {
    const styles = {
      button: {
        display: "block",
        width: "100%",
        textAlign: "start" as "start",
        padding: "5px 15px",
        border: "none",
        borderLeft: "3px solid transparent",
        marginBottom: "5px"
      },
      selected: {
        borderLeftColor: variables.color.accent
      }
    };

    const finalStyles = this.props.isSelected
      ? {
          ...styles.button,
          ...styles.selected
        }
      : styles.button;

    return (
      <li>
        <button onClick={this.onClick} style={finalStyles}>
          {this.props.children}
        </button>
      </li>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.id);
  };
}

export default Tab;
