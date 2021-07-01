import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { css } from 'styled-components';

import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { track } from '@codesandbox/common/lib/utils/analytics';

import Plus from '../../../assets/icons/Plus';

const MAIN_TEMPLATES = [
  'react-new',
  'vanilla-vanilla',
  'vue-vue',
  'angular-angular',
];

const HIDE_LIST = ['p5js-9tgmp', 'codesandbox-appsapper-template-88wlq002r8'];

const ListTemplateBVersion = () => {
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
    <>
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
            transition={{ duration: 0.4, ease: 'easeInOut' }}
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
          <ShowMoreButton
            onClick={() => {
              setShowMore(p => !p);
              track('Homepage - Template show more', { open: showMore });
            }}
          >
            <ShowMoreIcon active={showMore}>
              <Plus />
            </ShowMoreIcon>
            {showMore ? 'Less Template' : 'More Templates'}
          </ShowMoreButton>
        </ShowMoreButtonLine>
      </TemplateList>
    </>
  );
};

export { ListTemplateBVersion };

/**
 * Components
 */

const TemplateList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 850px;

  margin: 0 auto;
  padding: 0;
`;

const TemplateWrapper = styled.li`
  list-style: none;
  text-align: left;

  margin-bottom: 1rem;
  width: 100%;

  @media screen and (min-width: 460px) {
    width: calc(((100% - 1rem) / 2));
  }

  @media screen and (min-width: 650px) {
    width: calc(((100% - 1rem * 3) / 4));
  }

  border-radius: 4px;
  border: 1px solid ${props => props.theme.homepage.grey};

  transition: background 200ms ease;

  &:hover {
    background: #151515;
  }

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 1.1em 1em;
  }
`;

const TemplateTitle = styled.h3`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.homepage.white};

  margin: 0;
  margin-bottom: 0.3em;
`;

const TemplateDescription = styled.p`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 0.8rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #757575;
  margin: 0;
`;

const ShowMoreButtonLine = styled.div`
  width: 100%;
  border-top: 1px solid ${props => props.theme.homepage.grey};
  margin-top: 1em;
  text-align: center;
`;

const ShowMoreButton = styled.button`
  border: 0;
  background-color: ${props => props.theme.homepage.greyDark};
  color: #757575;
  transform: translateY(-1.7em);

  padding: 1em;
  display: inline-flex;
  align-items: center;

  cursor: pointer;
  transition: filter 200ms ease;

  &:hover {
    filter: brightness(1.5);
  }
`;

const ShowMoreIcon = styled.span`
  width: 21px;
  height: 21px;
  border-radius: 21px;
  display: inline-flex;
  margin-right: 0.6rem;

  transition: all 200ms ease;

  border: 1px solid #343434;
  background-color: #343434;

  color: ${props => props.theme.homepage.greyDark};

  svg {
    margin: auto;
    display: block;
    transition: all 200ms ease;
  }

  ${({ active, theme }) =>
    active &&
    css`
      color: #343434;
      background: ${theme.homepage.greyDark};

      svg {
        transform: rotate(135deg) translateX(-0.3px) translateY(0.1px);
      }
    `}
`;

const TemplateItem = ({ alias, iconUrl, title, environment, ...props }) => {
  const { UserIcon } = getTemplateIcon(iconUrl, environment);

  return (
    <TemplateWrapper {...props}>
      <a
        href={`https://codesandbox.io/s/${alias}`}
        onClick={() =>
          track('Homepage - Template clicked', { templateAlias: alias })
        }
      >
        <div css={{ marginRight: '1rem' }}>
          <UserIcon />
        </div>

        <div css={{ width: 'calc(100% - 32px - 1rem)' }}>
          <TemplateTitle>{title}</TemplateTitle>
          <TemplateDescription>{environment}</TemplateDescription>
        </div>
      </a>
    </TemplateWrapper>
  );
};
