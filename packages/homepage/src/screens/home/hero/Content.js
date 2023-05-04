import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

import Button from "../../../components/Button";
import react from "../../../assets/icons/home-react.svg";
import vanilla from "../../../assets/icons/home-js.svg";
import vue from "../../../assets/icons/home-vue.svg";
import angular from "../../../assets/icons/home-angular.svg";
import html from "../../../assets/icons/home-html.svg";
import more from "../../../assets/icons/home-more.svg";

const Content = () => (
  <>
    <SandboxButtons>
      <Sandbox href="/s/new" title="React" style={{ animationDelay: "0.5s" }}>
        <img src={react} alt="React Template" />
      </Sandbox>
      <Sandbox
        href="/s/vanilla"
        title="Vanilla"
        style={{
          animationDelay: "0.6s",
        }}
      >
        <img src={vanilla} alt="Vanilla Template" />
      </Sandbox>
      <Sandbox href="/s/vue" title="Vue" style={{ animationDelay: "0.7s" }}>
        <img src={vue} alt="Vue Template" />
      </Sandbox>
      <Sandbox
        href="/s/angular"
        title="Angular"
        style={{
          animationDelay: "0.8s",
        }}
      >
        <img src={angular} alt="angular Template" />
      </Sandbox>
      <Sandbox
        href="/s/github/codesandbox-app/static-template/tree/master/"
        title="HTML 5"
        style={{
          animationDelay: "0.9s",
        }}
      >
        <img src={html} alt="HTML Template" />
      </Sandbox>
      <Sandbox href="/s" title="More" style={{ animationDelay: "1.0s" }}>
        <img src={more} alt="More Template" />
      </Sandbox>
    </SandboxButtons>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
    >
      <Button big href="/s">
        <strong>{"</>"}</strong> Start coding for free
      </Button>
    </motion.div>
  </>
);

const SandboxButtons = styled.section`
  height: auto;
  width: auto;
  margin: 5rem 0;
  transition: all 200ms ease-in;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Sandbox = styled.a`
  display: flex;
  opacity: 0.4;
  border: none;
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  transition: transform 200ms cubic-bezier(0.455, 0.030, 0.515, 0.955), opacity 200ms 100ms;
  justify-content: center;
  animation: easeInOutBack 1s cubic-bezier(0, -0.6, 0.12, 2) 1s backwards;
  width: 3rem;
  height: 3rem;
  margin: 0 0.5rem;
  ${(props) => props.theme.breakpoints.md} {
    width: 4rem;
    height: 4rem;
  }
  ${(props) => props.theme.breakpoints.sm} {
    width: 2rem;
    height: 2rem;
  }
  :hover {
    cursor: pointer;
    animation-play-state: paused;
    transform: scale(1.1);
    opacity: 1;
  }
  @keyframes easeInOutBack {
    0% {
      opacity: 0;
      transform: scale(0.01);
    }

    100% {
      opacity: 0.4;
      transform: scale(1);
    }
  }
`;

export { Content };
