import track from '@codesandbox/common/lib/utils/analytics';
import {
  ArticleCard,
  CreateCard,
  Element,
  Stack,
} from '@codesandbox/components';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import React from 'react';

const DESCRIPTION =
  "Open any open-source repository on CodeSandbox and just click 'Branch' to start contributing.<br />Don't worry about forking and setting up a new repository. We'll take care of everything for you.";

const SUGGESTED_REPOS = [
  {
    owner: 'codesandbox',
    name: 'sandpack',
    url: 'https://codesandbox.io/p/github/codesandbox/sandpack/main',
  },
  {
    owner: 'excalidraw',
    name: 'excalidraw',
    url: 'https://codesandbox.io/p/github/excalidraw/excalidraw/master',
  },
  {
    owner: 'pmndrs',
    name: 'react-three-fiber',
    url: 'https://codesandbox.io/p/github/pmndrs/react-three-fiber/master',
  },
];

export const EmptyContributions: React.FC = () => {
  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <Stack direction="vertical" gap={4}>
        <EmptyPage.StyledGridTitle>
          Start contributing
        </EmptyPage.StyledGridTitle>
        <EmptyPage.StyledGrid as="ul">
          {SUGGESTED_REPOS.map(r => {
            const slug = `${r.owner}/${r.name}`;
            return (
              <Element as="li" key={slug}>
                <CreateCard
                  icon="github"
                  label={slug}
                  onClick={() => {
                    track(
                      'Contribution branches: open suggested repo from empty state',
                      {
                        repo: slug,
                        codesandbox: 'V1',
                        event_source: 'UI',
                      }
                    );
                    window.open(r.url);
                  }}
                />
              </Element>
            );
          })}
          <ArticleCard
            title="More about Contribution Branches"
            thumbnail="/static/img/thumbnails/contributions.png"
            url="https://codesandbox.io/docs/learn/getting-started/open-source#introducing-contribution-branches"
          />
        </EmptyPage.StyledGrid>
      </Stack>
    </EmptyPage.StyledWrapper>
  );
};
