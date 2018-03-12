import * as React from 'react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
<<<<<<< HEAD:packages/app/src/app/components/CodeEditor/Configuration/index.js
import type { Module } from 'common/types';
import getUI from 'common/templates/configuration/ui';
=======
>>>>>>> refactor components to TS:packages/app/src/app/components/CodeEditor/Configuration/index.tsx
import getType from 'app/utils/get-type';
import Tooltip from 'common/components/Tooltip';
import CodeIcon from 'react-icons/lib/md/code';
import { Container, Icon, Title, Description } from './elements';
import { Module } from 'app/store/modules/editor/types'
import { Props as CodeEditorProps } from '../'

type Props = CodeEditorProps & {
  config: any // TODO: Created from some util
  toggleConfigUI: () => void
  dependencies: any
};

export default class Configuration extends React.PureComponent<Props> {
  disposeInitializer?: () => void;
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
