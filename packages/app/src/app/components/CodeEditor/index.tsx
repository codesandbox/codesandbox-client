import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import getDefinition from '@codesandbox/common/lib/templates';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import React from 'react';
import QuestionIcon from 'react-icons/lib/go/question';
import UIIcon from 'react-icons/lib/md/dvr';

import { Icon, Icons } from './elements';
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

    const { isModuleSynced, sandbox, currentModule: module, settings } = props;

    const template = getDefinition(sandbox.template);
    const modulePath = module.path;
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
        {config &&
          (getUI(config.type) && !settings.experimentVSCode ? (
            <Icons>
              <Tooltip content="Switch to UI Configuration">
                <Icon onClick={this.toggleConfigUI}>
                  <UIIcon />
                </Icon>
              </Tooltip>
            </Icons>
          ) : (
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
                  <QuestionIcon style={{ marginLeft: '.5rem' }} />
                </Tooltip>
              ) : (
                <div>Supported Configuration</div>
              )}
            </Icons>
          ))}
        <VSCode />
      </div>
    );
  }
}
