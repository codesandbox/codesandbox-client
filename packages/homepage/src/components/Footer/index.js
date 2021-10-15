import React from 'react';
import { Link } from 'gatsby';
import { P } from '../Typography';
import Github from '../../assets/icons/github';
import Twitter from '../../assets/icons/twitter';
import Discord from '../../assets/icons/discord';
import { OPEN_JOBS_COUNT } from '../../config/hiring';
import { FooterWrapper, Nav, Social, Title } from './elements';

const footerNavElements = [
  {
    title: 'Product',
    elements: [
      {
        text: 'Coding',
        link: '/coding',
      },
      {
        text: 'Prototyping',
        link: '/prototyping',
      },
      {
        text: 'Knowledge Sharing',
        link: '/knowledge-sharing',
      },
      {
        text: 'Feedback',
        link: '/feedback',
      },
      {
        text: 'What’s New',
        link: '/changelog',
      },
    ],
  },
  {
    title: 'Explore',
    elements: [
      {
        text: 'Featured Sandboxes',
        link: '/explore',
      },
      {
        external: true,
        text: 'Search Sandboxes',
        link: '/search',
      },
    ],
  },
  {
    title: 'For',
    elements: [
      {
        text: 'Individuals',
        link: '/personal',
      },
      {
        text: 'Teams',
        link: '/team',
      },
      {
        text: 'Enterprise',
        link: '/enterprise',
      },
    ],
  },
  {
    title: 'About',
    elements: [
      {
        text: 'Pricing',
        link: '/pricing',
      },
      {
        text: 'Company',
        link: '/company',
      },
      {
        text: 'Blog',
        link: '/blog',
      },
      {
        text: 'Podcasts',
        link: '/podcasts',
      },
      {
        text: 'Jobs ',
        link: '/jobs',
        count: OPEN_JOBS_COUNT,
      },
      {
        text: 'Terms Of Use',
        link: '/legal/terms',
      },
      {
        text: 'Privacy Policy',
        link: '/legal/privacy',
      },
    ],
  },
  {
    title: 'Support',
    elements: [
      {
        text: 'Documentation',
        link: '/docs',
      },
      {
        text: 'Contact Support',
        external: true,
        link: 'mailto:support@codesandbox.io',
      },
      {
        text: 'Status',
        external: true,
        link: 'https://status.codesandbox.io/',
      },
    ],
  },
];

const Footer = () => (
  <FooterWrapper>
    <Nav>
      {footerNavElements.map(menu => (
        <ul key={menu.title}>
          <li>
            <Title>{menu.title}</Title>
          </li>
          {menu.elements.map(({ text, link, count = 0, external }) => (
            <li key={text}>
              <P small muted>
                {external ? (
                  <a href={link}>{text}</a>
                ) : (
                  <Link to={link}>
                    {text} {count !== 0 && <span>{count}</span>}
                  </Link>
                )}
              </P>
            </li>
          ))}
        </ul>
      ))}
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
        <a title="Join our Discord Server" href="https://discord.gg/5BpufEP7MH">
          <Discord />
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
      Copyright © {new Date().getFullYear()} CodeSandbox BV
    </P>
  </FooterWrapper>
);

export default Footer;
