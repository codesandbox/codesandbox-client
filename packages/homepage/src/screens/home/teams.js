import React from 'react';
import styled from 'styled-components';
import { P } from '../../components/Typography';

import zendesk from '../../assets/images/zendesk.svg';
import gitlab from '../../assets/images/gitlab.svg';
import atlassian from '../../assets/images/atlassian.svg';
import shopify from '../../assets/images/shopify.svg';
import algolia from '../../assets/images/Algolia.svg';

const List = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  margin-top: 2rem;
  margin-bottom: 12rem;

  li:not(:last-child) {
    margin-right: 5rem;
  }
`;

const Teams = () => (
  <>
    <P
      muted
      css={`
        text-align: center;
        margin-top: 12rem;
      `}
    >
      Accelerating the most creative developers and product teams
    </P>
    <List>
      <li>
        <a
          href="https://www.zendesk.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={zendesk} alt="Zendesk" />
        </a>
      </li>
      <li>
        <a
          href="https://www.atlassian.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={atlassian} alt="Atlasian" />
        </a>
      </li>
      <li>
        <a
          href="https://www.shopify.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={shopify} alt="Shopify" />
        </a>
      </li>
      <li>
        <a
          href="https://www.algolia.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={algolia} alt="Algolia" />
        </a>
      </li>
      <li>
        <a
          href="https://www.gitlab.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={gitlab} alt="Gitlab" />
        </a>
      </li>
    </List>
  </>
);

export default Teams;
