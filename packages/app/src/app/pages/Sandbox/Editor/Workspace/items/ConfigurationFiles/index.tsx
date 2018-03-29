import * as React from 'react';
import getDefinition from 'common/templates';
import { resolveModule } from 'common/sandbox/modules';

import { connect } from 'app/fluent';
import { Module } from 'app/store/modules/editor/types'

import BookIcon from 'react-icons/lib/md/library-books';
import UIIcon from 'react-icons/lib/md/dvr';

import Tooltip from 'common/components/Tooltip';

import { Description, WorkspaceSubtitle } from '../../elements';
import {
  FilesContainer,
  File,
  FileTitle,
  FileDescription,
  CreateButton,
} from './elements';

type FileConfigProps = {
  path: string
  info: {
    module?: Module,
    config: any
  }
  createModule?: (title: string) => void
  openModule?: (moduleId: string) => void
};

const FileConfig: React.SFC<FileConfigProps> = ({
  info,
  path,
  createModule,
  openModule
}) => {
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
        {config.ui && (
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

export default connect()
  .with(({ state, signals }) => ({
    sandbox: state.editor.currentSandbox,
    moduleSelected: signals.editor.moduleSelected,
    moduleCreated: signals.files.moduleCreated
  }))
  .to(
    function ConfigurationFiles ({ sandbox, moduleSelected, moduleCreated }) {
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
                  openModule={id => {
                    moduleSelected({ id });
                  }}
                  path={path}
                  info={info}
                />
              );
            })}
            {Object.keys(restPaths).length && (
              <WorkspaceSubtitle>Other Configurations</WorkspaceSubtitle>
            )}
            {Object.keys(restPaths).map(path => {
              const info = restPaths[path];

              return (
                <FileConfig
                  createModule={title => {
                    moduleCreated({ title });
                  }}
                  path={path}
                  info={info}
                />
              );
            })}
          </FilesContainer>
        </div>
      );
    }
  )
