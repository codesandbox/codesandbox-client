/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FunctionIcon from 'react-icons/lib/fa/code';

import callApi from '../../../store/services/api';
import ReactIcon from '../../../components/ReactIcon';
import AngularIcon from '../../../components/AngularIcon';
import VueIcon from '../../../components/VueIcon';

import moduleEntity from '../../../store/entities/modules/';
import sandboxEntity from '../../../store/entities/sandboxes/';

import theme from '../../../../common/theme';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: ${props => props.theme.background2.lighten(1.5)};
`;

const Title = styled.h2`
  text-align: center;
  width: 100%;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

const Name = styled.h3`
  color: white;
  width: 100%;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-top: 0;
`;

const Icons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  flex-wrap: wrap;
  margin-top: 6rem;
  color: ${props => props.theme.background2.lighten(1.5)};
`;

const Icon = styled.div`
  transition: 0.3s ease all;
  position: relative;

  flex: 1;
  height: 15rem;
  width: 15rem;
  font-size: 10rem;
  text-align: center;

  ${(props) => {
    if (!props.disabled) {
      return `
        cursor: pointer;
        &:hover {
          background-color: ${props.theme.background()};
          color: ${props.theme.secondary()};
        }
      `;
    }
    return '';
  }}
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
};

type Props = {
  moduleActions: typeof moduleEntity.actions;
  sandboxActions: typeof sandboxEntity.actions;
};
type State = {
  presets: Array<Object>;
};
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class Create extends React.PureComponent {
  props: Props;
  state: State;

  state = {
    presets: [],
  };

  componentDidMount() {
    callApi('sandbox_presets').then((result) => {
      this.setState({ presets: result });
    });
  }

  render() {
    const { presets } = this.state;
    return (
      <Container>
        <div>
          <Title>Creating a sandbox</Title>
          <Name>What preset would you like to start with?</Name>

          {presets.length === 0 ? <Title>Loading...</Title> : (
            <Icons>
              <Icon>
                <FunctionIcon />
                <IconTitle>No Preset</IconTitle>
              </Icon>
              {presets.map(preset => (
                <Icon key={preset.id}>
                  {ICON_MAP[preset.icon]}
                  <IconTitle>{preset.name}</IconTitle>
                </Icon>
              ))}

              <Icon disabled>
                <VueIcon
                  color={theme.background2.lighten(0.4)()}
                  secondColor={theme.background2.lighten(1.5)()}
                />
                <IconTitle>Vue</IconTitle>
              </Icon>
              <Icon disabled>
                <AngularIcon />
                <IconTitle>AngularJS 2.0</IconTitle>
              </Icon>
            </Icons>
          )}
        </div>
      </Container>
    );
  }
}
export default connect(null, mapDispatchToProps)(Create);
