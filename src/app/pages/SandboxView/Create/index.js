/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FunctionIcon from 'react-icons/lib/fa/code';

import ReactIcon from '../../../components/ReactIcon';
import AngularIcon from '../../../components/AngularIcon';
import VueIcon from '../../../components/VueIcon';

import moduleEntity from '../../../store/entities/modules/';
import sandboxEntity from '../../../store/entities/sandboxes/';

import theme from '../../../../common/theme';

const Container = styled.div`
  position: relative;
  width: 100%;
  color: ${props => props.theme.background2.lighten(1.5)};;
  margin: 8rem 16rem;
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
  font-size: 3rem;
  font-weight: 300;
  margin-top: 0;
`;

const Icons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 6rem;
  color: ${props => props.theme.background2.lighten(1.5)};
`;

const Icon = styled.div`
  transition: 0.3s ease all;
  position: relative;

  height: 17rem;
  width: 17rem;
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
  font-size: 2rem;
  font-weight: 300;
  bottom: 2rem;
  left: 0;
  right: 0;
`;

type Props = {
  moduleActions: typeof moduleEntity.actions;
  sandboxActions: typeof sandboxEntity.actions;
};
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class Create extends React.PureComponent {
  props: Props;

  render() {
    return (
      <Container>
        <Title>Creating a sandbox</Title>
        <Name>What preset would you like to start with?</Name>

        <Icons>
          <Icon>
            <FunctionIcon />
            <IconTitle>No Preset</IconTitle>
          </Icon>
          <Icon>
            <ReactIcon />
            <IconTitle>React</IconTitle>
          </Icon>
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
      </Container>
    );
  }
}
export default connect(null, mapDispatchToProps)(Create);
