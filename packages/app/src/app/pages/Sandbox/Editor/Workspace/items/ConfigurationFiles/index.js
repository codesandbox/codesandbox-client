import React from 'react';
import getDefinition from 'common/lib/templates';
import getUI from 'common/lib/templates/configuration/ui';
import { Module, Configuration } from 'common/lib/types';
import { resolveModule } from 'common/lib/sandbox/modules';

import { inject, observer } from 'mobx-react';

import BookIcon from 'react-icons/lib/md/library-books';
import UIIcon from 'react-icons/lib/md/dvr';

import Tooltip from 'common/lib/components/Tooltip';

import { Description, WorkspaceSubtitle } from '../../elements';
import {
  FilesContainer,
  File,
  FileTitle,
  FileDescription,
  CreateButton,
} from './elements';

type FileConfigProps = {
  path: string,
  info: {
    module?: Module,
    config: Configuration,
  },
  createModule: (title: string) => void,
};

const FileConfig = ({
  info,
  path,
  createModule,
  openModule,
}: FileConfigProps) => {
  const { module, config } = info;
  return (
    <File
      created={!!module}
      key={path}
      onClick={
        openModule
          ? () => {
              openModule(module.id);
            }
          : undefined
      }
    >
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
        {getUI(config.type) && (
          <Tooltip title="Editable with UI">
            <UIIcon style={{ marginLeft: '.5rem' }} />
          </Tooltip>
        )}
      </FileTitle>
      <FileDescription>{config.description}</FileDescription>
      {!module && (
        <CreateButton
          onClick={() => {
            // TODO make this support nested paths (create dir etc)
            createModule(info.config.title);
          }}
        >
          Create File
        </CreateButton>
      )}
    </File>
  );
};

const ConfigurationFiles = ({ store, signals }) => {
  const sandbox = store.editor.currentSandbox;
  const { configurationFiles } = getDefinition(sandbox.template);

  const createdPaths = {};
  const restPaths = {};

  Object.keys(configurationFiles)
    .sort()
    .forEach(p => {
      const config = configurationFiles[p];

      try {
        const module = resolveModule(p, sandbox.modules, sandbox.directories);
        createdPaths[p] = {
          config,
          module,
        };
      } catch (e) {
        restPaths[p] = {
          config,
        };
      }
    });

  return (
    <div>
      <Description>
        CodeSandbox supports several config files per template, you can see and
        edit all supported files for the current sandbox here.
      </Description>

      <FilesContainer>
        <WorkspaceSubtitle>Existing Configurations</WorkspaceSubtitle>
        {Object.keys(createdPaths).map(path => {
          const info = createdPaths[path];

          return (
            <FileConfig
              key={path}
              openModule={id => {
                signals.editor.moduleSelected({ id });
              }}
              path={path}
              info={info}
            />
          );
        })}
        {!!Object.keys(restPaths).length && (
          <WorkspaceSubtitle>Other Configurations</WorkspaceSubtitle>
        )}
        {Object.keys(restPaths).map(path => {
          const info = restPaths[path];

          return (
            <FileConfig
              key={path}
              createModule={title => {
                signals.files.moduleCreated({ title });
              }}
              path={path}
              info={info}
            />
          );
        })}
      </FilesContainer>
    </div>
  );
};

export default inject('signals', 'store')(observer(ConfigurationFiles));
