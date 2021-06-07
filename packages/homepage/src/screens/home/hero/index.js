import React from 'react';
import { motion } from 'framer-motion';
import { useStaticQuery, graphql } from 'gatsby';

import {
  TemplateItem,
  TemplateList,
  HeroWrapper,
  Title,
  SubTitle,
} from './elements';

export default () => {
  const {
    allOfficialTemplate: { nodes },
  } = useStaticQuery(graphql`
    query OfficialTemplates {
      allOfficialTemplate {
        nodes {
          id
          author {
            username
          }
          alias
          custom_template {
            color
            id
            icon_url
          }
          description
          environment
          title
        }
      }
    }
  `);

  return (
    <HeroWrapper>
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', staggerChildren: 0.5 }}
        style={{
          zIndex: 20,
        }}
      >
        <Title>Where teams build faster, together</Title>
        <SubTitle
          css={`
            margin-bottom: 2rem;
          `}
        >
          Create, share, and get feedback with collaborative sandboxes for rapid
          web development.
        </SubTitle>

        <TemplateList>
          {nodes.map(template => (
            <TemplateItem
              key={template.alias}
              alias={template.alias}
              title={template.title}
              environment={template.environment}
            />
          ))}
        </TemplateList>
      </motion.div>
    </HeroWrapper>
  );
};
