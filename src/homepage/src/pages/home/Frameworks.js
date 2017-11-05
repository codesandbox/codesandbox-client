import React from 'react';
import styled, { css } from 'styled-components';

import MaxWidth from 'app/components/flex/MaxWidth';
import Column from 'app/components/flex/Column';
import Row from 'app/components/flex/Row';
import Padding from 'app/components/spacing/Padding';
import Margin from 'app/components/spacing/Margin';

import RollingText from '../../components/RollingText';
import Button from '../../components/Button';
import { Heading3 } from '../../components/headings';

import media from '../../utils/media';

const Container = styled.div`
  transition: 0.3s ease all;
  border-radius: 2px;

  background-color: ${({ color, theme }) => theme.background};

  box-shadow: 0 3px 200px ${({ color }) => color.clearer(0.8)};

  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const Pane = styled(MaxWidth)`
  display: flex;
  flex-direction: row;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.4;
  border-radius: 4px;

  margin-top: 2rem;
  margin-bottom: 16rem;
  margin-left: 2rem;
  margin-right: 2rem;

  z-index: 2;

  ${media.tablet`
    flex-direction: column;
  `};
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const IconContainer = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: 96px;
  height: 96px;

  border-radius: 2px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  ${({ selected, template }) =>
    selected &&
    css`
      background-color: ${template.color.clearer(0.9)};

      &:hover {
        background-color: ${template.color.clearer(0.9)};
      }
    `};
`;

const Buttons = styled.div`
  display: flex;
  font-size: 1rem;

  a {
    margin-top: 1rem;
  }
`;

const TemplateName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-weight: 300;
  font-size: 2rem;
  margin: 0;
  padding: 2rem;
  padding-bottom: 0;
  border-radius: 2px;

  color: white;
  /* background-color: ${({ color }) => color}; */

  svg {
    display: block;
  }

  h4 {
    margin-left: 1rem;
    margin-bottom: 0;
    font-weight: 200;
    font-size: 2rem;
  }
`;

const Supported = styled.div`
  font-weight: 400;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.secondary};
`;

const TemplateDescription = styled.p`
  font-size: 1.125rem;
`;

export default class Frameworks extends React.PureComponent {
  render() {
    const { template, templates, setTemplate } = this.props;

    return (
      <Pane width={1280}>
        <Column style={{ marginRight: '2rem' }} flex={4}>
          <Heading3>Tailored for web applications</Heading3>
          <p>
            We know how overwhelming JavaScript development can be. With
            CodeSandbox we specifically focus on{' '}
            <strong>web application development</strong> to make the experience
            as smooth as possible. Just open your browser and start coding.
          </p>

          <Supported>Supported libraries</Supported>

          <Icons>
            {templates.map(({ Icon }, i) => (
              <IconContainer
                key={i}
                selected={templates[i] === template}
                template={templates[i]}
                onClick={() => {
                  setTemplate(templates[i]);
                }}
              >
                <Icon width={64} height={64} />
              </IconContainer>
            ))}
          </Icons>
        </Column>
        <Column flex={4}>
          <Container color={template.color}>
            <RollingText>
              <TemplateName color={template.color}>
                <template.Icon width={96} height={96} />
                <h4>{template.niceName}</h4>
              </TemplateName>
            </RollingText>
            <Padding margin={2}>
              <TemplateDescription>{template.description}</TemplateDescription>
              <Buttons>
                <Button color={template.color}>Create Project</Button>

                <Button secondary color={template.color}>
                  Show Examples
                </Button>
              </Buttons>
            </Padding>
          </Container>
        </Column>
      </Pane>
    );
  }
}
