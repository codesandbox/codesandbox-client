import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { getModulePath } from '@codesandbox/common/es/sandbox/modules';
import getDefinition from '@codesandbox/common/es/templates';
import getUI from '@codesandbox/common/es/templates/configuration/ui';
import React from 'react';
import { GoQuestion } from 'react-icons/go';

import { Icons } from './elements';
import { Props } from './types'; // eslint-disable-line
import { VSCode } from './VSCode';

type State = {
  showConfigUI: boolean;
};

export class CodeEditor extends React.PureComponent<
  Props & {
    editor?: 'vscode' | 'monaco' | 'codemirror';
    style?: React.CSSProperties;
  },
  State
> {
  state = {
    showConfigUI: true,
  };

  toggleConfigUI = () => {
    this.setState(state => ({ showConfigUI: !state.showConfigUI }));
  };

  render() {
    const { props } = this;

    const { isModuleSynced, sandbox, currentModule: module } = props;

    const template = getDefinition(sandbox.template);
    const modulePath = getModulePath(
      sandbox.modules,
      sandbox.directories,
      module.id
    );
    const config = template.configurationFiles[modulePath];

    return (
      <div
        style={{
          height: props.height || '100%',
          width: props.width || '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...props.style,
        }}
      >
        {!isModuleSynced(module.shortid) && module.title === 'index.html' && (
          <Icons>
            You may have to save this file and refresh the preview to see
            changes
          </Icons>
        )}
        {config && getUI(config.type) ? (
          <Icons>
            {config.partialSupportDisclaimer ? (
              <Tooltip
                placement="bottom"
                content={config.partialSupportDisclaimer}
                style={{
                  display: 'flex',
                  'align-items': 'center',
                }}
              >
                Partially Supported Config{' '}
                <GoQuestion style={{ marginLeft: '.5rem' }} />
              </Tooltip>
            ) : (
              <div>Supported Configuration</div>
            )}
          </Icons>
        ) : null}
        <VSCode {...props} />
      </div>
    );
  }
}
