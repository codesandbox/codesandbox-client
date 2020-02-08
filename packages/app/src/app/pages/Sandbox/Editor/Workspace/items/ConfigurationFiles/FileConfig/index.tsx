import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import { Module, Configuration } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import UIIcon from 'react-icons/lib/md/dvr';
import BookIcon from 'react-icons/lib/md/library-books';

import { CreateButton, File, FileDescription, FileTitle } from './elements';

type Props = {
  path: string;
  info: {
    module?: Module;
    config: Configuration;
  };
  createModule?: (title: string) => void;
  openModule?: (id: string) => void;
};
export const FileConfig: FunctionComponent<Props> = ({
  info: { module, config },
  path,
  createModule,
  openModule,
}) => (
  <File
    created={Boolean(module)}
    key={path}
    onClick={openModule ? () => openModule(module.id) : undefined}
  >
    <FileTitle>
      {config.title}{' '}
      <Tooltip content="More Info">
        <a
          href={config.moreInfoUrl}
          target="_blank"
          rel="noreferrer noopener"
          title="Documentation"
          style={{ marginLeft: '.25rem' }}
        >
          <BookIcon />
        </a>
      </Tooltip>
      {getUI(config.type) && (
        <Tooltip content="Editable with UI">
          <UIIcon style={{ marginLeft: '.5rem' }} />
        </Tooltip>
      )}
    </FileTitle>

    <FileDescription>{config.description}</FileDescription>

    {!module && (
      <CreateButton
        // TODO make this support nested paths (create dir etc)
        onClick={() => createModule(config.title)}
      >
        Create File
      </CreateButton>
    )}
  </File>
);
