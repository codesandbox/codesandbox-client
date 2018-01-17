import React from 'react';
import getDefinition from 'common/templates';
import { inject, observer } from 'mobx-react';

import BookIcon from 'react-icons/lib/md/library-books';
import UIIcon from 'react-icons/lib/md/dvr';

import Tooltip from 'common/components/Tooltip';

import { Description } from '../../elements';
import { FilesContainer, File, FileTitle, FileDescription } from './elements';

const ConfigurationFiles = ({ store }) => {
  const { configurations } = getDefinition(
    store.editor.currentSandbox.template
  );

  return (
    <div>
      <Description>
        CodeSandbox supports several config files per template, you can see and
        edit all supported files for the current sandbox here.
      </Description>

      <FilesContainer>
        {Object.keys(configurations).map(path => {
          const config = configurations[path];

          return (
            <File key={path}>
              <FileTitle>
                {config.title}{' '}
                <Tooltip title="More Info">
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
                {config.ui && (
                  <Tooltip title="Editable with UI">
                    <UIIcon style={{ marginLeft: '.5rem' }} />
                  </Tooltip>
                )}
              </FileTitle>
              <FileDescription>{config.description}</FileDescription>
            </File>
          );
        })}
      </FilesContainer>
    </div>
  );
};

export default inject('signals', 'store')(observer(ConfigurationFiles));
