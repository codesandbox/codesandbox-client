import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { searchUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import SearchIcon from 'react-icons/lib/go/search';
import Media from 'react-media';
import { Link } from 'react-router-dom';

import { HeaderSearchBar } from 'app/components/HeaderSearchBar';

import { Action } from '../elements';

type Props = {
  searchNoInput?: boolean;
};
export const SearchAction: FunctionComponent<Props> = ({ searchNoInput }) => (
  <Action>
    <Media query="(max-width: 920px)">
      {matches =>
        matches || searchNoInput ? (
          <Tooltip content="Search All Sandboxes" placement="bottom">
            <Link
              aria-label="Search All Sandboxes"
              style={{ color: 'white' }}
              to={searchUrl()}
            >
              <SearchIcon height={35} />
            </Link>
          </Tooltip>
        ) : (
          <HeaderSearchBar />
        )
      }
    </Media>
  </Action>
);
