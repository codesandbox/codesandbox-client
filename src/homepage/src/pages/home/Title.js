import React from 'react';
import styled, { css } from 'styled-components';

import { sandboxUrl } from 'app/utils/url-generator';
import { fadeIn } from '../../utils/animation';
import RollingText from '../../components/RollingText';

const Container = styled.div`
  color: white;
  flex: 2;
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 4rem;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
`;

const SubTitle = styled.h2`
  font-weight: 300;
  font-size: 2.5rem;
  line-height: 1.2;
  padding-bottom: 2rem;

  color: rgba(255, 255, 255, 0.9);

  ${fadeIn(0.4)};
`;

const getGradient = color => {
  return css`linear-gradient(
  45deg,
  ${color},
  ${color.darken(0.2)}
)`;
};

const Button = styled.a`
  position: relative;
  background: ${({ color, secondary }) =>
    secondary ? '' : getGradient(color)};
  border: none;
  ${({ color, theme, secondary }) =>
    secondary &&
    css`
      position: relative;
      border: 4px solid transparent;
      border-image-slice: 1;
      background-clip: padding-box;
      background: ${theme.background()};

      &::after {
        position: absolute;
        top: -8px;
        bottom: -8px;
        left: -8px;
        right: -8px;
        background: ${getGradient(color)};
        content: '';
        z-index: -1;
        border-radius: 4px;
      }
    `} outline: none;
  padding: 0.75rem 1.5rem;
  font-weight: 300;
  font-size: 1.25rem;
  border-radius: 4px;
  color: ${({ color, secondary }) => (secondary ? color : 'white')};
  box-shadow: 0 0 100px ${props => props.color.clearer(0.3)};
  text-transform: uppercase;

  text-decoration: none;
`;

const Buttons = styled.div`
  display: flex;

  a {
    margin: 0 0.5rem;
  }
`;

const Primary = styled.div`
  display: inline-block;
  ${fadeIn(0.3)};
  color: ${props => props.theme.primary};
`;

const Secondary = styled.div`
  display: inline-block;
  ${fadeIn(0.2)};
  color: ${props => props.theme.secondary};
`;

export default ({ template }) => (
  <Container>
    <Title>
      <Secondary>Code</Secondary>
      <Primary>Sandbox</Primary>
    </Title>
    <SubTitle>
      The online code editor for&nbsp;
      <RollingText width="12rem">
        <span style={{ color: template.color() }}>{template.niceName}</span>
      </RollingText>
    </SubTitle>

    <RollingText width="32rem">
      <Buttons>
        <Button
          href={sandboxUrl({ shortid: template.shortid })}
          color={template.color}
        >
          Open {template.niceName}
        </Button>

        <Button
          href={sandboxUrl({ shortid: template.shortid })}
          color={template.color}
          secondary
        >
          Explore Examples
        </Button>
      </Buttons>
    </RollingText>
  </Container>
);
