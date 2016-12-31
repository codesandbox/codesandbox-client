/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerContext } from 'react-router/PropTypes';
import FunctionIcon from 'react-icons/lib/fa/code';

import callApi from '../../../store/services/api';
import ReactIcon from '../../../components/ReactIcon';

import moduleEntity from '../../../store/entities/modules/';
import sandboxEntity from '../../../store/entities/sandboxes/';

import { editModuleUrl } from '../../../utils/url-generator';
import delayEffect from '../../../utils/animation/delay-effect';
import SubTitle from '../../../components/text/SubTitle';
import Button from '../../../components/buttons/Button';

const Container = styled.div`
  position: relative;
  ${delayEffect(0)}
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: ${props => props.theme.background2.lighten(1.5)};
`;

const ButtonContainer = styled.div`
  ${delayEffect(0.4)}
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

const Name = styled.div`
  input {
    ${delayEffect(0.15)}
    opacity: 0;
    color: white;
    font-size: 2.5rem;
    font-weight: 300;
    background-color: transparent;
    margin-top: 0;
    border: none;
    outline: none;
    text-align: center;
  }
  input::-webkit-input-placeholder {
    color: ${props => props.theme.background2.lighten(2.9)};
  }
`;

const Icons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  flex-wrap: wrap;
  margin-top: 3rem;
  margin-bottom: 3rem;
  color: ${props => props.theme.background2.lighten(1.5)};
`;

const Icon = styled.div`
  transition: 0.3s ease all;
  position: relative;

  ${props => delayEffect(0.2 + (props.index * 0.1))};

  flex: 1;
  height: 13rem;
  width: 13rem;
  opacity: 0;
  font-size: 8rem;
  text-align: center;

  cursor: pointer;

  ${props => props.active && `
    background-color: ${props.theme.primary()};
    color: ${props.theme.primaryText()};
  `}

  &:hover {
    background-color: ${props => !props.active && props.theme.background};
    color: ${props => !props.active && props.theme.primary};
  }
`;

const IconTitle = styled.div`
  position: absolute;
  font-size: 1.5rem;
  font-weight: 300;
  bottom: 1.5rem;
  left: 0;
  right: 0;
`;

const ICON_MAP = {
  react: <ReactIcon />,
  nopreset: <FunctionIcon />,
};

type Props = {
  sandboxActions: sandboxEntity.actions;
};
type State = {
  presets: Array<Object>;
  selectedPreset: string;
  sandboxTitle: string;
  creating: boolean;
};
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class Create extends React.PureComponent {
  static contextTypes = {
    router: routerContext,
  }

  props: Props;
  state: State;

  state = {
    presets: [],
    selectedPreset: '',
    sandboxTitle: '',
    creating: false,
  };

  updateTitle = (event: KeyboardEvent) => {
    this.setState({ sandboxTitle: event.target.value });
  }

  componentDidMount() {
    callApi('sandbox_presets').then((result) => {
      this.setState({ presets: result.data });
    });
  }

  isSandboxValid = () => {
    const { sandboxTitle, selectedPreset } = this.state;
    return sandboxTitle && selectedPreset;
  };

  createSandbox = async () => {
    this.setState({ creating: true });

    const { presets, sandboxTitle, selectedPreset } = this.state;
    const forkPreset = presets.find(p => p.id === selectedPreset);
    const preset = forkPreset ? forkPreset.sourceId : null;
    const result = await this.props.sandboxActions.createSandbox(sandboxTitle, preset);

    if (result instanceof Error) {
      this.setState({ creating: false });
    } else {
      const username = result.author ? result.author.username : null;
      const url = editModuleUrl({ ...result, author: username });
      this.context.router.transitionTo(url);
    }
  };

  render() {
    const { presets, sandboxTitle, selectedPreset, creating } = this.state;
    if (presets.length === 0) return <SubTitle>Loading...</SubTitle>;

    if (creating) {
      return (
        <Container>
          <SubTitle>Creating sandbox, hang tight!</SubTitle>
        </Container>
      );
    }

    return (
      <Container>
        <div>
          <SubTitle>Creating a sandbox</SubTitle>
          <Name>
            <input
              placeholder="Enter a Sandbox Name"
              onChange={this.updateTitle}
              value={sandboxTitle}
              ref={e => e && e.focus()}
            />
          </Name>

          <Icons>
            {presets.map((preset, i) => (
              <Icon
                key={preset.id}
                index={i}
                active={selectedPreset === preset.id}
                onClick={() => this.setState({ selectedPreset: preset.id })}
              >
                {ICON_MAP[preset.icon]}
                <IconTitle>{preset.name}</IconTitle>
              </Icon>
            ))}
          </Icons>

          <ButtonContainer>
            <Button
              disabled={!this.isSandboxValid()}
              onClick={this.createSandbox}
            >
              GET STARTED
            </Button>
          </ButtonContainer>
        </div>
      </Container>
    );
  }
}
export default connect(null, mapDispatchToProps)(Create);
