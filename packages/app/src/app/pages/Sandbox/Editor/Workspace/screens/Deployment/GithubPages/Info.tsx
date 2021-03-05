import React from 'react';
import { Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';

const info = [
  {
    name: 'publicPath',
    template: 'vue-cli',
    link: 'https://cli.vuejs.org/guide/deployment.html#github-pages',
  },
  {
    name: 'pathPrefix',
    template: 'gatsby',
    link:
      'https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/how-gatsby-works-with-github-pages/#deploying-to-a-path-on-github-pages',
  },
  {
    name: 'base',
    template: 'vuepress',
    link: 'https://vuepress.vuejs.org/guide/deploy.html#github-pages',
  },
  {
    name: 'base',
    link: 'https://nuxtjs.org/docs/2.x/deployment/github-pages/',
    template: 'nuxt',
  },
  {
    template: 'gridsome',
    link: 'https://gridsome.org/docs/deploy-to-github/',
    name: 'pathPrefix',
  },
];

export const Info = ({
  template,
  path,
}: {
  template: string;
  path: string;
}) => {
  const templateInfo = info.find(link => template === link.template);
  if (!templateInfo) return null;

  return (
    <Element marginTop={2}>
      <Text variant="muted">
        Make sure you have{' '}
        <a
          css={css({
            color: 'sideBar.foreground',
            // monaco overrides it
            textDecoration: 'underline !important',
          })}
          href={templateInfo.link}
          target="_blank"
          rel="noreferrer"
        >
          config
        </a>{' '}
        is setup. Your{' '}
        <Text
          css={css({
            fontFamily: 'MonoLisa',
          })}
        >
          {templateInfo.name}
        </Text>{' '}
        is:{' '}
        <Text
          css={css({
            fontFamily: 'MonoLisa',
            color: 'sideBar.foreground',
          })}
        >
          {path}
        </Text>
      </Text>
    </Element>
  );
};
