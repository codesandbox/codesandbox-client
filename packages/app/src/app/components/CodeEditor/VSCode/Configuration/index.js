// @flow
import React from 'react';
import type { Module } from 'common/lib/types';
import getUI from 'common/lib/templates/configuration/ui';
import getType from 'app/utils/get-type';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import theme from 'common/lib/theme';

import type { Props as EditorProps, Editor } from '../../types';
import { Container, Title, Description } from './elements';

type Props = EditorProps & {
  config: Object,
  toggleConfigUI: () => void,
};

export default class Configuration extends React.PureComponent<Props>
  implements Editor {
  disposeInitializer: ?() => void;

  currentModule: Module;
  receivingCode: ?boolean = false;

  constructor(props: Props) {
    super(props);

    this.registerListeners();
  }

  registerListeners() {
    if (this.props.onDidChangeDirty) {
      this.dirtyChangeListener = this.props.onDidChangeDirty(() => {
        this.forceUpdate();
        this.props.onChange(
          this.props.getCode(),
          this.props.currentModule.shortid
        );
      });
    }

    this.props.onDispose(() => {
      this.dirtyChangeListener.dispose();
    });
  }

  componentDidMount() {
    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentModule.id !== this.props.currentModule.id) {
      this.dirtyChangeListener.dispose();

      this.registerListeners();
    }
  }

  componentWillUnmount() {
    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
  }

  updateFile = (code: string) => {
    const { isLive, sendTransforms } = this.props;

    if (isLive && sendTransforms && !this.receivingCode) {
      this.sendLiveChanges(code);
    }

    this.props.onChangeVSCode(code, this.props.currentModule.shortid);
  };

  render() {
    const { config, width, height, sandbox } = this.props;
    const currentModule = this.props.currentModule;

    const { ConfigWizard } = getUI(config.type);

    return (
      <Container style={{ width, height }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EntryIcons
            width={32}
            height={32}
            type={getType(currentModule.title)}
          />
          <Title>{config.title}</Title>
        </div>
        <button
          style={{
            outline: 0,
            border: 0,
            backgroundColor: 'transparent',
            color: theme.secondary(),
            textDecoration: 'underline',
            margin: 0,
            padding: 0,
            marginTop: '1rem',
            cursor: 'pointer',
          }}
          tabIndex={-1}
          onClick={() => this.props.openText()}
        >
          Open file in editor
        </button>
        <Description>
          {config.description}{' '}
          <a
            href={config.moreInfoUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            More info...
          </a>
        </Description>

        <ConfigWizard
          sandbox={sandbox}
          updateFile={this.updateFile}
          file={this.props.getCode()}
        />
      </Container>
    );
  }
}
