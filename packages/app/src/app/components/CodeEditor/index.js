// @flow

import React from 'react';
import Loadable from 'app/utils/Loadable';
import Loading from 'app/components/Loading';
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
import ImageViewer from './ImageViewer';
import Configuration from './Configuration';
import MonacoDiff from './MonacoDiff';
import { Icons, Icon } from './elements';

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
        <div
          style={{
            height: props.height || '100%',
            width: props.width || '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <MonacoDiff
            originalCode={currentTab.codeA}
            modifiedCode={currentTab.codeB}
            title={currentTab.fileTitle}
            {...props}
          />
        </div>
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
    if (config && getUI(config.type) && this.state.showConfigUI) {
      return (
        <Configuration
          {...props}
          dependencies={dependencies}
          config={config}
          toggleConfigUI={this.toggleConfigUI}
        />
      );
    }

    if (module.isBinary) {
      if (isImage(module.title)) {
        return <ImageViewer {...props} dependencies={dependencies} />;
      }

      return (
        <Margin
          style={{
            overflow: 'auto',
            height: props.height || '100%',
            width: props.width || '100%',
          }}
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

    const Editor =
      (settings.vimMode || settings.codeMirror) && !props.isLive
        ? CodeMirror
        : Monaco;

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
        }}
      >
        {!isModuleSynced &&
          module.title === 'index.html' && (
            <Icons style={{ fontSize: '.875rem' }}>
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
            <Icons style={{ fontSize: '.875rem' }}>
              {config.partialSupportDisclaimer ? (
                <Tooltip
                  position="bottom"
                  title={config.partialSupportDisclaimer}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
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
        <Editor {...props} dependencies={dependencies} />
      </div>
    );
  }
}
