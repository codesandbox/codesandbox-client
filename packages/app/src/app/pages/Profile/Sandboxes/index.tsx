import { Button } from '@codesandbox/common/lib/components/Button';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { SandboxList } from 'app/components/SandboxList';
import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Navigation, NoSandboxes, Notice } from './elements';

const PER_PAGE_COUNT = 15;

interface Props {
  page: number;
  baseUrl: string;
  source: any;
}

export const Sandboxes: React.FC<Props> = ({ page = 1, source, baseUrl }) => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    function getPage(pageSource, newPage) {
      if (!pageSource) {
        return undefined;
      }
      return pageSource[newPage];
    }

    function fetch(force = false) {
      if (state.profile.isLoadingSandboxes) {
        return;
      }

      if (
        force ||
        !state.profile[source] ||
        !getPage(state.profile[source], page)
      ) {
        switch (source) {
          case 'currentSandboxes':
            actions.profile.sandboxesPageChanged({ page });
            break;
          case 'currentLikedSandboxes':
            actions.profile.likedSandboxesPageChanged({ page });
            break;
          default:
        }
      }
    }

    fetch();
  }, [actions.profile, page, source, state.profile]);

  function getSandboxesByPage(sandboxes, newPage) {
    return sandboxes[newPage];
  }

  function getLastPage() {
    if (source === 'currentSandboxes') {
      const { sandboxCount } = state.profile.current;

      return Math.ceil(sandboxCount / PER_PAGE_COUNT);
    }

    const { givenLikeCount } = state.profile.current;

    return Math.ceil(givenLikeCount / PER_PAGE_COUNT);
  }

  function deleteSandbox(id) {
    actions.profile.deleteSandboxClicked({ id });
  }

  const { isLoadingSandboxes, isProfileCurrentUser } = state.profile;
  const sandboxes = state.profile[source];

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
            <Button
              style={{ margin: '0 0.5rem' }}
              small
              to={`${baseUrl}/${page - 1}`}
            >
              {'<'}
            </Button>
          )}
          {getLastPage() !== page && (
            <Button
              style={{ margin: '0 0.5rem' }}
              small
              to={`${baseUrl}/${page + 1}`}
            >
              {'>'}
            </Button>
          )}
        </div>
      </Navigation>
    </div>
  );
};
