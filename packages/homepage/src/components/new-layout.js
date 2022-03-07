import React from "react";
import { ThemeProvider } from "styled-components";

import { ThemeProvider as NewThemeProvider } from "@codesandbox/components";
import codesandboxBlack from "@codesandbox/components/lib/themes/codesandbox-black";

import theme from "@codesandbox/common/lib/theme";
import { VisuallyHidden } from "./style";
import Privacy from "./Toast";
import "../css/typography.css";
import "../css/global.css";
import Navigation from "./Navigation";
import DocsNavigation from "./DocsNavigation";
import Footer from "./Footer";

const text = (number) => `@media only screen and (max-width: ${number}px)`;

export const SMALL_BREAKPOINT = 576;
export const MEDIUM_BREAKPOINT = 768;
export const LARGE_BREAKPOINT = 1024;
export const EXTRA_LARGE_BREAKPOINT = 1200;

const homepageTheme = {
  ...theme,
  breakpoints: {
    sm: text(SMALL_BREAKPOINT),
    md: text(MEDIUM_BREAKPOINT),
    lg: text(LARGE_BREAKPOINT),
    xl: text(EXTRA_LARGE_BREAKPOINT),
  },
  homepage: {
    appleFont:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue'",
    white: "#fff",
    whiteDark: "#e6e6e6",
    primary: "#0971f1",
    greyLight: "#757575",
    grey: "#242424",
    greyDark: "#040404",
    muted: "#999",
    blue: "#0971F1",
    black: "#000",
  },
};

export const WRAPPER_STYLING = {
  maxWidth: "80%",
  width: "1200px",
  margin: "auto",
};

export const useTheme = () => homepageTheme;

const TemplateWrapper = ({ children, noWrapperStyling, docs }) => (
  <ThemeProvider theme={homepageTheme}>
    <div style={{ fontSize: "13px" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <VisuallyHidden as="a" href="#main">
          Skip to main content
        </VisuallyHidden>
      </div>
      {docs ? <DocsNavigation /> : <Navigation />}

      <NewThemeProvider theme={codesandboxBlack}>
        <main
          style={noWrapperStyling ? {} : WRAPPER_STYLING}
          id="main"
          aria-label="main content"
        >
          {children}
        </main>
      </NewThemeProvider>

      {docs ? "" : <Footer />}
    </div>
    <Privacy />
  </ThemeProvider>
);

export default TemplateWrapper;
