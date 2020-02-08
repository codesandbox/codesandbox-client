import { ConfigurationFile } from '@codesandbox/common/lib/templates/configuration/types';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceSubtitle } from '../../elements';

import { FileConfig } from './FileConfig';

type Props = {
  paths: {
    [key: string]: {
      config: ConfigurationFile;
    };
  };
};
export const OtherConfigurations: FunctionComponent<Props> = ({ paths }) => {
  const {
    actions: {
      files: { moduleCreated },
    },
  } = useOvermind();

  if (Object.entries(paths).length === 0) {
    return null;
  }

  return (
    <>
      <WorkspaceSubtitle>Other Configurations</WorkspaceSubtitle>

      {Object.entries(paths).map(([path, info]) => (
        <FileConfig
          createModule={title =>
            moduleCreated({ directoryShortid: null, title })
          }
          info={info}
          key={path}
          path={path}
        />
      ))}
    </>
  );
};
