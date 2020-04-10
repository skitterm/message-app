import React, { Component } from "react";
import Header from "../Header";

class Profile extends Component {
  public render() {
    return (
      <div>
        <Header path="/" label="Home" />
        <h1>Profile</h1>
      </div>
    );
  }
}

export default Profile;
