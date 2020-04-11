import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import variables from "./styles/variables";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        color: ${variables.color.textDark};
    }

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        font-family: "Lato", sans-serif;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
        monospace;
    }

    p {
        font-family: "PT Serif", serif;
    }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
