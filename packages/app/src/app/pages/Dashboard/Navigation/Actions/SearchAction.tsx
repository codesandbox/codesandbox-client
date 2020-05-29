import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { searchUrl } from '@codesandbox/common/es/utils/url-generator';
import { HeaderSearchBar } from 'app/components/HeaderSearchBar';
import React, { FunctionComponent } from 'react';
import { GoSearch } from 'react-icons/go';
import Media from 'react-media';
import { Link } from 'react-router-dom';

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
              <GoSearch height={35} />
            </Link>
          </Tooltip>
        ) : (
          <HeaderSearchBar />
        )
      }
    </Media>
  </Action>
);
