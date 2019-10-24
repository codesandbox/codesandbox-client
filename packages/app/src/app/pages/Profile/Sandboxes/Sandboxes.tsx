import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { SandboxList } from 'app/components/SandboxList';
import { NoSandboxes } from './NoSandboxes';
import { Navigation, NavButton, Notice } from './elements';

const PER_PAGE_COUNT = 15;

interface ISandboxesProps {
  source: string;
  page?: number;
  baseUrl: string;
}

export const Sandboxes: React.FC<ISandboxesProps> = ({
  source,
  page = 1,
  baseUrl,
}) => {
  const {
    state: { profile },
    actions: {
      profile: {
        sandboxesPageChanged,
        likedSandboxesPageChanged,
        deleteSandboxClicked,
      },
    },
  } = useOvermind();
  const { isProfileCurrentUser, isLoadingSandboxes } = profile;
  const sandboxes = profile[source];

  const sandboxesPageChangedCallback = useCallback(sandboxesPageChanged, [
    page,
  ]);

  const likedSandboxesPageChangedCallback = useCallback(
    likedSandboxesPageChanged,
    [page]
  );

  useEffect(() => {
    const fetch = (force = false) => {
      if (isLoadingSandboxes) {
        return;
      }

      if (force || !sandboxes || !getPage(sandboxes, page)) {
        switch (source) {
          case 'currentSandboxes':
            sandboxesPageChangedCallback({ page, force });
            break;
          case 'currentLikedSandboxes':
            likedSandboxesPageChangedCallback({ page });
            break;
          default:
        }
      }
    };
    fetch();
  }, [
    page,
    source,
    isLoadingSandboxes,
    sandboxes,
    sandboxesPageChangedCallback,
    likedSandboxesPageChangedCallback,
  ]);

  const getPage = (sourcePage: any, pageNumber: number) => {
    if (!sourcePage) {
      return undefined;
    }
    return sourcePage.get ? sourcePage.get(pageNumber) : sourcePage[pageNumber];
  };

  const getSandboxesByPage = (allSandboxes: any, pageNumber: number) =>
    allSandboxes.get ? allSandboxes.get(pageNumber) : allSandboxes[pageNumber];

  // Get Last Page
  const getLastPage = () => {
    if (source === 'currentSandboxes') {
      const { sandboxCount } = profile.current;

      return Math.ceil(sandboxCount / PER_PAGE_COUNT);
    }

    const { givenLikeCount } = profile.current;

    return Math.ceil(givenLikeCount / PER_PAGE_COUNT);
  };

  // Delete Sandbox
  const deleteSandbox = (id: string) => {
    deleteSandboxClicked({ id });
  };

  if (
    isLoadingSandboxes ||
    !sandboxes ||
    !getSandboxesByPage(sandboxes, page)
  ) {
    return <div />;
  }

  const sandboxesPage = getSandboxesByPage(sandboxes, page);

  if (sandboxesPage.length === 0)
    return <NoSandboxes source={source} isCurrentUser={isProfileCurrentUser} />;

  return (
    <div>
      {isProfileCurrentUser && (
        <Notice>
          You
          {"'"}
          re viewing your own profile, so you can see your private and unlisted
          sandboxes. Others can
          {"'"}
          t. To manage your sandboxes you can go to your dashboard{' '}
          <Link to={dashboardUrl()}>here</Link>.
        </Notice>
      )}
      <SandboxList
        isCurrentUser={isProfileCurrentUser}
        sandboxes={sandboxesPage}
        onDelete={source === 'currentSandboxes' && deleteSandbox}
      />
      <Navigation>
        <div>
          {page > 1 && (
            <NavButton to={`${baseUrl}/${page - 1}`}>{'<'}</NavButton>
          )}
          {getLastPage() !== page && (
            <NavButton to={`${baseUrl}/${page + 1}`}>{'>'}</NavButton>
          )}
        </div>
      </Navigation>
    </div>
  );
};
