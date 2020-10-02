import React from 'react';
import { motion } from 'framer-motion';

import zendesk from '../../../assets/images/zendesk.svg';
import gitlab from '../../../assets/images/gitlab.svg';
import atlassian from '../../../assets/images/atlassian.svg';
import shopify from '../../../assets/images/shopify.svg';
import algolia from '../../../assets/images/Algolia.svg';

import { List, Title } from './elements';

const Teams = () => (
  <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{
        duration: 1,
        ease: 'easeIn',
      }}
    >
      <Title muted>
        Accelerating the most creative developers and product teams
      </Title>
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
    </motion.div>
);

export default Teams;
