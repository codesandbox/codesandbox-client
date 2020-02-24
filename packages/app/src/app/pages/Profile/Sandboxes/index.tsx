import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { ComponentProps, FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SandboxList } from 'app/components/SandboxList';
import { useOvermind } from 'app/overmind';

import { NavButton, Navigation, Notice } from './elements';
import { NoSandboxes } from './NoSandboxes';

const noop = () => undefined;
const PER_PAGE_COUNT = 15;

type Props = {
  baseUrl: string;
  page?: number;
} & Pick<ComponentProps<typeof NoSandboxes>, 'source'>;
export const Sandboxes: FunctionComponent<Props> = ({
  page = 1,
  source,
  baseUrl,
}) => {
  const {
    actions: {
      profile: {
        deleteSandboxClicked,
        likedSandboxesPageChanged,
        sandboxesPageChanged,
      },
    },
    state: {
      profile: {
        current: { givenLikeCount, sandboxCount },
        isLoadingSandboxes,
        isProfileCurrentUser,
        [source]: sandboxes,
      },
    },
  } = useOvermind();
  const lastPage =
    source === 'currentSandboxes'
      ? Math.ceil(sandboxCount / PER_PAGE_COUNT)
      : Math.ceil(givenLikeCount / PER_PAGE_COUNT);
  const empty = !sandboxes || !sandboxes[page];

  useEffect(() => {
    if (isLoadingSandboxes) {
      return;
    }

    if (empty) {
      if (source === 'currentSandboxes') {
        sandboxesPageChanged(page);
      } else if (source === 'currentLikedSandboxes') {
        likedSandboxesPageChanged(page);
      }
    }
  }, [
    empty,
    isLoadingSandboxes,
    likedSandboxesPageChanged,
    page,
    sandboxes,
    sandboxesPageChanged,
    source,
  ]);

  if (isLoadingSandboxes || empty) {
    return null;
  }

  if (sandboxes[page].length === 0) {
    return <NoSandboxes source={source} />;
  }

  return (
    <div>
      {isProfileCurrentUser && (
        <Notice>
          {`You're viewing your own profile, so you can see your private and unlisted sandboxes. Others can't. To manage your sandboxes you can go to your dashboard`}{' '}
          <Link to={dashboardUrl()}>here</Link>.
        </Notice>
      )}

      <SandboxList
        isCurrentUser={isProfileCurrentUser}
        onDelete={source === 'currentSandboxes' ? deleteSandboxClicked : noop}
        // @ts-ignore
        sandboxes={sandboxes[page]}
      />

      <Navigation>
        <div>
          {page > 1 && (
            <NavButton to={`${baseUrl}/${page - 1}`}>{'<'}</NavButton>
          )}

          {lastPage !== page && (
            <NavButton to={`${baseUrl}/${page + 1}`}>{'>'}</NavButton>
          )}
        </div>
      </Navigation>
    </div>
  );
};
