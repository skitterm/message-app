import React, { Component } from "react";
import { Link } from "react-router-dom";

interface Props {
  path: string;
  label: string;
}

class Header extends Component<Props> {
  public render() {
    return (
      <header>
        <Link to={this.props.path}>{this.props.label}</Link>
      </header>
    );
  }
}

export default Header;
