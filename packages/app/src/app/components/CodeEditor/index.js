// @flow

import React from 'react';
import Loadable from 'app/utils/Loadable';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import getUI from 'common/templates/configuration/ui';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import isImage from 'common/utils/is-image';
import getDefinition from 'common/templates';
import type { Sandbox } from 'common/types';
import { getModulePath } from 'common/sandbox/modules';
import Tooltip from 'common/components/Tooltip';
import UIIcon from 'react-icons/lib/md/dvr';
import QuestionIcon from 'react-icons/lib/go/question';

import type { Props } from './types';
import Monaco from './Monaco';
import VSCode from './VSCode';
import ImageViewer from './ImageViewer';
import Configuration from './Configuration';
import MonacoDiff from './MonacoDiff';
import { Icons, Icon, Container } from './elements';

const CodeMirror = Loadable(() =>
  import(/* webpackChunkName: 'codemirror-editor' */ './CodeMirror')
);

const getDependencies = (sandbox: Sandbox): ?{ [key: string]: string } => {
  const packageJSON = sandbox.modules.find(
    m => m.title === 'package.json' && m.directoryShortid == null
  );

  if (packageJSON != null) {
    try {
      const { dependencies = {}, devDependencies = {} } = JSON.parse(
        packageJSON.code || ''
      );

      const usedDevDependencies = {};
      Object.keys(devDependencies).forEach(d => {
        if (d.startsWith('@types')) {
          usedDevDependencies[d] = devDependencies[d];
        }
      });

      return { ...dependencies, ...usedDevDependencies };
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    return typeof sandbox.npmDependencies.toJS === 'function'
      ? sandbox.npmDependencies.toJS()
      : sandbox.npmDependencies;
  }
};

type State = {
  showConfigUI: boolean,
};

export default class CodeEditor extends React.PureComponent<Props, State> {
  state = {
    showConfigUI: true,
  };

  toggleConfigUI = () => {
    this.setState({ showConfigUI: !this.state.showConfigUI });
  };

  render() {
    const props = this.props;

    const {
      isModuleSynced,
      currentTab,
      sandbox,
      currentModule: module,
      settings,
    } = props;

    if (currentTab && currentTab.type === 'DIFF') {
      return (
        <Container width={props.width} height={props.height}>
          <MonacoDiff
            originalCode={currentTab.codeA}
            modifiedCode={currentTab.codeB}
            title={currentTab.fileTitle}
            {...props}
          />
        </Container>
      );
    }

    const dependencies = getDependencies(sandbox);

    const template = getDefinition(sandbox.template);
    const modulePath = getModulePath(
      sandbox.modules,
      sandbox.directories,
      module.id
    );
    const config = template.configurationFiles[modulePath];
    if (
      !settings.experimentVSCode &&
      config &&
      getUI(config.type) &&
      this.state.showConfigUI
    ) {
      return (
        <Configuration
          {...props}
          dependencies={dependencies}
          config={config}
          toggleConfigUI={this.toggleConfigUI}
        />
      );
    }

    if (!settings.experimentVSCode && module.isBinary) {
      if (isImage(module.title)) {
        return <ImageViewer {...props} dependencies={dependencies} />;
      }

      return (
        <Margin
          css={`
            overflow: auto;
            height: ${p => p.height || '100%'};
            width: ${p => p.width || '100%'};
          `}
          top={2}
        >
          <Centered horizontal vertical>
            <Title>This file is too big to edit</Title>
            <SubTitle>
              We will add support for this as soon as possible.
            </SubTitle>

            <a href={module.code} target="_blank" rel="noreferrer noopener">
              Open file externally
            </a>
          </Centered>
        </Margin>
      );
    }

    let Editor =
      (settings.vimMode || settings.codeMirror) && !props.isLive
        ? CodeMirror
        : Monaco;

    if (settings.experimentVSCode) {
      Editor = VSCode;
    }

    return (
      <Conatiner>
        {!isModuleSynced && module.title === 'index.html' && (
          <Icons small>
            You may have to save this file and refresh the preview to see
            changes
          </Icons>
        )}
        {config &&
          (getUI(config.type) ? (
            <Icons>
              <Tooltip title="Switch to UI Configuration">
                <Icon onClick={this.toggleConfigUI}>
                  <UIIcon />
                </Icon>
              </Tooltip>
            </Icons>
          ) : (
            <Icons small>
              {config.partialSupportDisclaimer ? (
                <Tooltip
                  position="bottom"
                  title={config.partialSupportDisclaimer}
                  css={`
                    display: flex;
                    align-items: center;
                  `}
                >
                  Partially Supported Config{' '}
                  <QuestionIcon
                    css={`
                      margin-left: 0.5rem;
                    `}
                  />
                </Tooltip>
              ) : (
                <div>Supported Configuration</div>
              )}
            </Icons>
          ))}
        <Editor {...props} dependencies={dependencies} />
      </Conatiner>
    );
  }
}
