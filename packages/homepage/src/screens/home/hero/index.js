import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaticQuery, graphql } from 'gatsby';

import {
  TemplateItem,
  TemplateList,
  HeroWrapper,
  Title,
  SubTitle,
  ShowMoreIcon,
  ShowMoreButton,
  ShowMoreButtonLine,
} from './elements';
import Plus from '../../../assets/icons/Plus';

const MAIN_TEMPLATES = [
  'react-new',
  'vanilla-vanilla',
  'vue-vue',
  'angular-angular',
];

const HIDE_LIST = ['p5js-9tgmp', 'codesandbox-appsapper-template-88wlq002r8'];

export default () => {
  const [showMore, setShowMore] = useState(false);

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

  const mainTemplates = nodes
    .filter(e => MAIN_TEMPLATES.includes(e.alias))
    .sort((a, b) => {
      if (MAIN_TEMPLATES.indexOf(a.alias) > MAIN_TEMPLATES.indexOf(b.alias)) {
        return 1;
      }

      return -1;
    });
  const allNodesSort = nodes
    .filter(e => !MAIN_TEMPLATES.includes(e.alias))
    .filter(e => !HIDE_LIST.includes(e.alias))
    .sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      }

      return -1;
    })
    .slice(0, 28);

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
            margin-bottom: 3.7rem;
          `}
        >
          Create, share, and get feedback with collaborative sandboxes for rapid
          web development.
        </SubTitle>

        <TemplateList>
          {mainTemplates.map((template, index) => (
            <TemplateItem
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: (index + 1) * 0.3, delay: 1 }}
              as={motion.li}
              key={template.alias}
              alias={template.alias}
              title={template.title}
              environment={template.environment}
              iconUrl={template.custom_template.icon_url}
            />
          ))}
        </TemplateList>

        <AnimatePresence>
          {showMore && (
            <TemplateList
              as={motion.div}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              {allNodesSort.map((template, index) => (
                <TemplateItem
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: Math.min((index + 1) * 0.3, 1.6) }}
                  as={motion.li}
                  key={template.alias}
                  alias={template.alias}
                  title={template.title}
                  environment={template.environment}
                  iconUrl={template.custom_template.icon_url}
                />
              ))}
            </TemplateList>
          )}
        </AnimatePresence>

        <TemplateList>
          <ShowMoreButtonLine
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          >
            <ShowMoreButton onClick={() => setShowMore(p => !p)}>
              <ShowMoreIcon active={showMore}>
                <Plus />
              </ShowMoreIcon>
              {showMore ? 'Less Template' : 'More Templates'}
            </ShowMoreButton>
          </ShowMoreButtonLine>
        </TemplateList>
      </motion.div>
    </HeroWrapper>
  );
};
