// @flow
import React from 'react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';
import Tooltip from 'common/components/Tooltip';

import CodeIcon from 'react-icons/lib/md/code';
import SaveIcon from 'react-icons/lib/md/save';

import type { Props } from '../types';
import { Container, Icon, Title, Description } from './elements';

export default class Configuration extends React.PureComponent<
  Props & {
    config: Object,
    toggleConfigUI: () => void,
  }
> {
  disposeInitializer: ?() => void;

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

  changeCode() {
    this.forceUpdate();
  }

  updateFile = (code: string) => {
    this.props.onChange(code);
  };

  render() {
    const { config, currentModule, width, height } = this.props;

    const { ConfigWizard } = config.ui;

    return (
      <Container style={{ width, height }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EntryIcons
            width={32}
            height={32}
            type={getType(currentModule.title, currentModule.code)}
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
