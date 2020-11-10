import React from 'react';
import { motion } from 'framer-motion';

import stripe from '../../../assets/images/stripe.svg';
import microsoft from '../../../assets/images/microsoft.svg';
import atlassian from '../../../assets/images/atlassian.svg';
import shopify from '../../../assets/images/shopify.svg';
import algolia from '../../../assets/images/Algolia.svg';

import { List } from './elements';
import { P } from '../../../components/Typography';

const Teams = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      duration: 1,
      ease: 'easeIn',
    }}
    css={`
      margin: 0 auto;
      padding: 1.5rem 0;
    `}
  >
    <P
      css={`
        text-align: center;
      `}
      muted
    >
      Accelerating the most creative developers and product teams
    </P>
    <List>
      <li>
        <a
          href="https://www.stripe.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={stripe} alt="stripe" />
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
          href="https://www.microsoft.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={microsoft} alt="microsoft" />
        </a>
      </li>
    </List>
  </motion.div>
);

export default Teams;
