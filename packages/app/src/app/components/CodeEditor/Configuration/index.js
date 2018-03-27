// @flow
import React from 'react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import type { Module } from 'common/types';
import getType from 'app/utils/get-type';
import Tooltip from 'common/components/Tooltip';

import CodeIcon from 'react-icons/lib/md/code';

import type { Props as EditorProps, Editor } from '../types';
import { Container, Icon, Title, Description } from './elements';

type Props = EditorProps & {
  config: Object,
  toggleConfigUI: () => void,
};

export default class Configuration extends React.PureComponent<Props>
  implements Editor {
  disposeInitializer: ?() => void;

  currentModule: Module;

  constructor(props: Props) {
    super(props);

    this.currentModule = props.currentModule;
  }

  componentDidMount() {
    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this);
    }
  }

  componentWillUnmount() {
    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
  }

  // eslint-disable-next-line
  changeCode = (code: string) => {
    this.forceUpdate();
  };

  changeModule = (newModule: Module) => {
    this.currentModule = newModule;
  };

  updateFile = (code: string) => {
    this.props.onChange(code);
  };

  render() {
    const { config, width, height } = this.props;
    const currentModule = this.currentModule;

    const { ConfigWizard } = config.ui;

    return (
      <Container style={{ width, height }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EntryIcons
            width={32}
            height={32}
            type={getType(currentModule.title)}
          />
          <Title>{config.title}</Title>

          <Tooltip title="Show Code">
            <Icon onClick={this.props.toggleConfigUI}>
              <CodeIcon />
            </Icon>
          </Tooltip>
        </div>
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

        <ConfigWizard updateFile={this.updateFile} file={currentModule.code} />
      </Container>
    );
  }
}
