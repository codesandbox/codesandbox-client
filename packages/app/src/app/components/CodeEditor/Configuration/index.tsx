import React from 'react';
import { TextOperation } from 'ot';
import { Module } from '@codesandbox/common/lib/types';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import { getType } from 'app/utils/get-type';
import { EntryIcons } from 'app/components/EntryIcons';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { ConfigurationFile } from '@codesandbox/common/lib/templates/configuration/types';

import CodeIcon from 'react-icons/lib/md/code';

import { Props as EditorProps, Editor } from '../types'; // eslint-disable-line
import { Container, Icon, Title, Description } from './elements';

type Props = EditorProps & {
  config: ConfigurationFile;
  toggleConfigUI: () => void;
};

export class Configuration extends React.PureComponent<Props> {
  disposeInitializer?: Function;

  currentModule: Module;
  receivingCode: boolean = false;

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

  setReceivingCode = (receiving: boolean) => {
    this.receivingCode = receiving;
  };

  sendLiveChanges = (code: string) => {
    const { sendTransforms, isLive, onCodeReceived } = this.props;
    if (sendTransforms) {
      const oldCode = this.currentModule.code || '';

      // We don't know exactly what changed, just that the code changed. So
      // we send the whole code.

      const op = new TextOperation();

      op.delete(oldCode.length);
      op.insert(code);

      sendTransforms(op);
    } else if (!isLive && onCodeReceived) {
      onCodeReceived();
    }
  };

  changeModule = (newModule: Module) => {
    this.currentModule = newModule;
  };

  updateFile = (code: string) => {
    const { isLive, sendTransforms } = this.props;

    if (isLive && sendTransforms && !this.receivingCode) {
      this.sendLiveChanges(code);
    }

    this.props.onChange(code);
  };

  render() {
    const { config, width, height, sandbox } = this.props;
    const { currentModule } = this;

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

          <Tooltip content="Show Code">
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

        <ConfigWizard
          sandbox={sandbox}
          updateFile={this.updateFile}
          file={currentModule.code}
        />
      </Container>
    );
  }
}
