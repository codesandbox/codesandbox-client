import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Main,
  PageContent,
  Navigation,
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
  SearchRow,
  // FeaturedPlaceholder,
  PinnedPlaceholder,
  SandboxCount,
  PinnedGrid,
  TitleRow,
  SectionTitle,
  ShowcaseGrid,
  PageNav,
} from './elements';
import { initialState } from './DELETEME';

export const Profile: React.FC<RouteComponentProps> = () => {
  // Replace with API
  const [data, setData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  // TODO:
  // - Add Query to retrieve user data
  // - Add page navigation handler to load additional sandboxes
  // - Add search input handler to filter on all sandboxes
  // - Add Edit toggle for logged-in user
  // - Add drag and drop support for grids

  return (
    <Main>
      <Navigation />
      <PageContent>
        <Content>
          <UserInfo
            canEdit
            isEditing={isEditing}
            toggleEditing={() => setIsEditing(!isEditing)}
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
          />
          {data.user.featured && <FeaturedSandbox {...data.user.featured} />}
          <SearchRow>
            <SearchInput />
            <SandboxCount>
              <em>{data.user.totalSandboxes}</em>
              Sandboxes
            </SandboxCount>
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
              <ShowcaseGrid>
                {data.user.sandboxes.map(sandbox => (
                  <ShowcaseCard key={sandbox.id} {...sandbox} />
                ))}
              </ShowcaseGrid>
              <PageNav>
                <Pagination pages={10} />
              </PageNav>
            </>
          )}
        </Content>
      </PageContent>
    </Main>
  );
};
