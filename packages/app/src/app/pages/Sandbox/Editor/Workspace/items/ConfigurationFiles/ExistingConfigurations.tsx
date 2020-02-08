import { ConfigurationFile } from '@codesandbox/common/lib/templates/configuration/types';
import { Module } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceSubtitle } from '../../elements';

import { FileConfig } from './FileConfig';

type Props = {
  paths: {
    [key: string]: {
      config: ConfigurationFile;
      module: Module;
    };
  };
};
export const ExistingConfigurations: FunctionComponent<Props> = ({ paths }) => {
  const {
    actions: {
      editor: { moduleSelected },
    },
  } = useOvermind();

  return (
    <>
      <WorkspaceSubtitle>Existing Configurations</WorkspaceSubtitle>

      {Object.entries(paths).map(([path, info]) => (
        <FileConfig
          info={info}
          key={path}
          openModule={id => moduleSelected({ id })}
          path={path}
        />
      ))}
    </>
  );
};
