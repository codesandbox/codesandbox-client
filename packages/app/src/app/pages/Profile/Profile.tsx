import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useTabState } from 'reakit/Tab';
import {
  Layout,
  Pagination,
  SearchInput,
} from '@codesandbox/common/lib/components';
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
import { initialState } from './DELETEME';

export const Profile: React.FC<RouteComponentProps> = () => {
  // Replace with API
  const [data, setData] = useState(initialState);
  const [query, setQuery] = useState(``);
  const [isEditing, setIsEditing] = useState(false);
  const tabs = useTabState({
    manual: true,
    orientation: 'vertical',
    selectedId: 'Sandboxes',
  });

  // TODO:
  // - Add Query to retrieve user data
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

  const handleSearch: React.ComponentProps<
    typeof SearchInput
  >['onSubmit'] = values => {
    console.log(values); // eslint-disable-line
    setQuery(values.query);
  };

  const results = [];

  return (
    <Layout>
      <Content>
        <UserInfo
          canEdit
          isEditing={isEditing}
          toggleEditing={toggleEditing}
          onEdit={({ bio, socialLinks }) => {
            setData({
              ...data,
              user: {
                ...data.user,
                bio,
                socialLinks,
              },
            });
          }}
          {...data.user}
        >
          <Tabs {...tabs}>
            {data.user.sandboxes.length && (
              <Tab
                {...tabs}
                stopId="Sandboxes"
              >{`${data.user.sandboxes.length} Sandboxes`}</Tab>
            )}
            {data.user.templates.length && (
              <Tab
                {...tabs}
                stopId="Templates"
              >{`${data.user.templates.length} Templates`}</Tab>
            )}
            {data.user.likes.length && (
              <Tab
                {...tabs}
                stopId="Likes"
              >{`${data.user.likes.length} Likes`}</Tab>
            )}
          </Tabs>
        </UserInfo>

        {query.length && (
          <TabContent {...tabs} stopId="Search">
            <SearchRow>
              <SandboxCount>
                <em>{data.user.totalTemplates}</em>
                Results
              </SandboxCount>
              <SearchInput onSubmit={handleSearch} />
            </SearchRow>
            <SandboxGrid>
              {results.map(sandbox => (
                <ShowcaseCard key={sandbox.id} {...sandbox} />
              ))}
            </SandboxGrid>
            <PageNav>
              <Pagination pages={10} />
            </PageNav>
          </TabContent>
        )}

        <TabContent {...tabs} stopId="Sandboxes">
          {data.user.featured && <FeaturedSandbox {...data.user.featured} />}
          <SearchRow>
            <SandboxCount>
              <em>{data.user.totalSandboxes}</em>
              Sandboxes
            </SandboxCount>
            <SearchInput
              onSubmit={handleSearch}
              onChange={values => {
                console.log(values); // eslint-disable-line
              }}
            />
          </SearchRow>
          {isEditing && !data.user.pinned.length ? (
            <PinnedPlaceholder>
              Drag your Sandbox here to pin them to your profile
            </PinnedPlaceholder>
          ) : isEditing && data.user.pinned.length ? (
            <PinnedGrid>
              {data.user.pinned.map(sandbox => (
                <ShowcaseCard key={sandbox.id} {...sandbox} />
              ))}
              <DropPlaceholder>Drag Sandbox to pin</DropPlaceholder>
            </PinnedGrid>
          ) : (
            data.user.pinned && (
              <PinnedGrid>
                {data.user.pinned.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
              </PinnedGrid>
            )
          )}
          {data.user.sandboxes && (
            <>
              <TitleRow>
                <SectionTitle>All Sandboxes</SectionTitle>
              </TitleRow>
              <SandboxGrid>
                {data.user.sandboxes.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
              </SandboxGrid>
              <PageNav>
                <Pagination pages={10} />
              </PageNav>
            </>
          )}
        </TabContent>

        {data.user.totalTemplates && (
          <TabContent {...tabs} stopId="Templates">
            <SearchRow>
              <SandboxCount>
                <em>{data.user.totalTemplates}</em>
                Templates
              </SandboxCount>
              <SearchInput onSubmit={handleSearch} />
            </SearchRow>
            <SandboxGrid>
              {data.user.templates.map(sandbox => (
                <ShowcaseCard key={sandbox.id} {...sandbox} />
              ))}
            </SandboxGrid>
            <PageNav>
              <Pagination pages={10} />
            </PageNav>
          </TabContent>
        )}

        {data.user.totalLikes && (
          <TabContent {...tabs} stopId="Likes">
            <SearchRow>
              <SandboxCount>
                <em>{data.user.totalLikes}</em>
                Liked Sandboxes
              </SandboxCount>
              <SearchInput onSubmit={handleSearch} />
            </SearchRow>
            <SandboxGrid>
              {data.user.likes.map(sandbox => (
                <ShowcaseCard key={sandbox.id} {...sandbox} />
              ))}
            </SandboxGrid>
            <PageNav>
              <Pagination pages={10} />
            </PageNav>
          </TabContent>
        )}
      </Content>
    </Layout>
  );
};
