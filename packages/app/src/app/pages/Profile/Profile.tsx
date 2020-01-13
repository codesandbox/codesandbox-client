import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useTabState } from 'reakit/Tab';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits } from 'react-instantsearch-dom';
import { useOvermind } from 'app/overmind';
import { NotFound } from 'app/pages/common/NotFound';
import { Layout } from 'app/components/Layout';
import { Pagination, SearchInput } from '@codesandbox/common/lib/components';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX, // eslint-disable-line
} from '@codesandbox/common/lib/utils/config';
import {
  DropPlaceholder,
  // PlaceholderHeader
} from './DropPlaceholder';
import { FeaturedSandbox } from './FeaturedSandbox';
import { ShowcaseCard } from './ShowcaseCard';
import { UserInfo } from './UserInfo';
import {
  Content,
  Tabs,
  Tab,
  TabContent,
  SearchRow,
  // FeaturedPlaceholder,
  PinnedPlaceholder,
  SandboxCount,
  PinnedGrid,
  TitleRow,
  SectionTitle,
  SandboxGrid,
  PageNav,
} from './elements';

interface IProfileProps extends RouteComponentProps {
  match: {
    params: { username: string };
    url: string;
  };
}

const SearchSandboxes: React.ComponentClass = connectSearchBox(({ refine }) => (
  <SearchInput
    onChange={({ query }) => {
      refine(query);
    }}
  />
));

const Results = connectHits(
  ({ hits, children }) =>
    console.log(hits) ||
    // @ts-ignore
    children({ hits })
);

export const Profile: React.FC<IProfileProps> = ({
  match: {
    params: { username },
  },
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const tabs = useTabState({
    manual: true,
    orientation: 'vertical',
    selectedId: 'Sandboxes',
  });

  const {
    state: {
      profile: { current: user, notFound },
      user: currentUser,
      isLoggedIn,
    },
    actions: {
      profile: { profileMounted, editProfile },
    },
  } = useOvermind();

  const canEdit = isLoggedIn && user?.id === currentUser?.id;

  useEffect(() => {
    profileMounted({ username });
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }

  // TODO:
  // - Add page navigation handler to load additional sandboxes
  // - Add search input handler to filter on all sandboxes
  // - Add Edit toggle for logged-in user
  // - Add drag and drop support for grids

  const toggleEditing = () => {
    if (tabs.selectedId !== `Sandboxes`) {
      tabs.select(`Sandboxes`);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Layout title={user ? `Profile - ${user.name}` : `Profile`}>
      <InstantSearch
        appId={ALGOLIA_APPLICATION_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName={ALGOLIA_DEFAULT_INDEX}
      >
        <Configure hitsPerPage={20} />
        <Content>
          <UserInfo
            canEdit={canEdit}
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            onEdit={({ bio, socialLinks }) => {
              editProfile({
                ...user,
                bio,
                socialLinks,
              });
            }}
            {...user}
          >
            <Tabs {...tabs}>
              {user?.sandboxCount ? (
                <Tab
                  {...tabs}
                  stopId="Sandboxes"
                >{`${user.sandboxCount} Sandboxes`}</Tab>
              ) : null}
              {user?.templateCount ? (
                <Tab
                  {...tabs}
                  stopId="Templates"
                >{`${user.templateCount} Templates`}</Tab>
              ) : null}
              {user?.givenLikeCount ? (
                <Tab
                  {...tabs}
                  stopId="Likes"
                >{`${user.givenLikeCount} Likes`}</Tab>
              ) : null}
            </Tabs>
          </UserInfo>

          <Results>
            {({ hits }) =>
              hits.length ? (
                <TabContent {...tabs} stopId="Search">
                  <SearchRow>
                    <SandboxCount>
                      <em>{user?.templateCount}</em>
                      Results
                    </SandboxCount>
                    <SearchSandboxes />
                  </SearchRow>
                  <SandboxGrid>
                    {hits.map(sandbox => (
                      <ShowcaseCard key={sandbox.id} {...sandbox} />
                    ))}
                  </SandboxGrid>
                  <PageNav>
                    <Pagination pages={10} />
                  </PageNav>
                </TabContent>
              ) : null
            }
          </Results>

          <TabContent {...tabs} stopId="Sandboxes">
            {user?.featuredSandbox ? (
              <FeaturedSandbox id={user.featuredSandbox} />
            ) : null}
            <SearchRow>
              <SandboxCount>
                <em>{user?.sandboxCount || 0}</em>
                Sandboxes
              </SandboxCount>
              <SearchSandboxes />
            </SearchRow>
            {isEditing && !user?.pinnedSandboxes.length ? (
              <PinnedPlaceholder>
                Drag your Sandbox here to pin them to your profile
              </PinnedPlaceholder>
            ) : isEditing && user?.pinnedSandboxes.length ? (
              <PinnedGrid>
                {user?.pinnedSandboxes.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
                <DropPlaceholder>Drag Sandbox to pin</DropPlaceholder>
              </PinnedGrid>
            ) : (
              user?.pinnedSandboxes && (
                <PinnedGrid>
                  {user.pinnedSandboxes.map(sandbox => (
                    <ShowcaseCard key={sandbox.id} {...sandbox} />
                  ))}
                </PinnedGrid>
              )
            )}
            {user?.sandboxes && (
              <>
                <TitleRow>
                  <SectionTitle>All Sandboxes</SectionTitle>
                </TitleRow>
                <SandboxGrid>
                  {user.sandboxes.map(sandbox => (
                    <ShowcaseCard key={sandbox.id} {...sandbox} />
                  ))}
                </SandboxGrid>
                <PageNav>
                  <Pagination pages={10} />
                </PageNav>
              </>
            )}
          </TabContent>

          {user?.templateCount && (
            <TabContent {...tabs} stopId="Templates">
              <SearchRow>
                <SandboxCount>
                  <em>{user.templateCount}</em>
                  Templates
                </SandboxCount>
                <SearchSandboxes />
              </SearchRow>
              <SandboxGrid>
                {user.templates.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
              </SandboxGrid>
              <PageNav>
                <Pagination pages={10} />
              </PageNav>
            </TabContent>
          )}

          {user?.givenLikeCount && (
            <TabContent {...tabs} stopId="Likes">
              <SearchRow>
                <SandboxCount>
                  <em>{user.givenLikeCount}</em>
                  Liked Sandboxes
                </SandboxCount>
                <SearchSandboxes />
              </SearchRow>
              <SandboxGrid>
                {user.likes.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
              </SandboxGrid>
              <PageNav>
                <Pagination pages={10} />
              </PageNav>
            </TabContent>
          )}
        </Content>
      </InstantSearch>
    </Layout>
  );
};
