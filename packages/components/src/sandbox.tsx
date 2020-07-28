import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Button } from "./";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Button>hi</Button>
    </ThemeProvider>
  </React.StrictMode>,
  rootElement
);
