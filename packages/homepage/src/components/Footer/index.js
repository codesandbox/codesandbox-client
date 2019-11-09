import React from 'react';

import { P } from '../Typography';

import Github from '../../assets/icons/github';
import Twitter from '../../assets/icons/twitter';
import Spectrum from '../../assets/icons/spectrum';
import { FooterWrapper, Nav, Social } from './elements';

const Footer = () => (
  <FooterWrapper>
    <Nav>
      <ul>
        <li>
          <P big>Product</P>
        </li>
        {/* <li>
          <P small muted>
            <a href="">Online IDE</a>
          </P>
        </li> */}
        <li>
          <P small muted>
            <a href="/embeds">Embed</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="/ci">CodeSandbox CI</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="/teams">Teams</a>
          </P>
        </li>
        {/* <li>
          <P small muted>
            <a href="">What’s New</a>
          </P>
        </li> */}
      </ul>
      <ul>
        <li>
          <P big>Explore</P>
        </li>
        <li>
          <P small muted>
            <a href="/explore">Community Picks</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="/search">Search</a>
          </P>
        </li>
      </ul>
      <ul>
        <li>
          <P big>Use Cases</P>
        </li>
        <li>
          <P small muted>
            <a href="/prototyping">Prototyping</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">Learning</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">Hiring</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">Onboarding</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">Collaboration</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">Open Source</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="">DevRel</a>
          </P>
        </li>
      </ul>

      <ul>
        <li>
          <P big>About</P>
        </li>
        <li>
          <P small muted>
            <a href="">Company</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="/blog">Blog</a>
          </P>
        </li>
      </ul>

      <ul>
        <li>
          <P big>Support</P>
        </li>
        <li>
          <P small muted>
            <a href="/docs">Documentation</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="mailto:hello@codesandbox.io">Contact Support</a>
          </P>
        </li>
        <li>
          <P small muted>
            <a href="https://status.codesandbox.io">Status</a>
          </P>
        </li>
      </ul>
    </Nav>
    <Social>
      <li>
        <a
          title="Go to Github"
          href="https://github.com/codesandbox/codesandbox-client"
        >
          <Github />
        </a>
      </li>
      <li>
        <a title="Go to Twitter" href="https://twitter.com/codesandbox">
          <Twitter />
        </a>
      </li>
      <li>
        <a title="Go to Spectrum" href="https://spectrum.chat/codesandbox">
          <Spectrum />
        </a>
      </li>
    </Social>
    <P
      small
      muted
      css={`
        text-align: center;
      `}
    >
      Copyright © {new Date().getFullYear()} CodeSandbox
    </P>
  </FooterWrapper>
);

export default Footer;
