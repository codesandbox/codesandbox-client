import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'app/components/flex/MaxWidth';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';

import { Heading3 } from '../../components/headings';

import editorImage from './images/editor.png';
import autocompleteVideo from './videos/autocomplete.mp4';

const Strobe = styled.div`
  height: 6px;
  width: 100%;

  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.secondary} 0%,
    ${({ theme }) => theme.secondary.lighten(0.1)} 50%,
    ${({ theme }) => theme.secondary} 100%
  );

  box-shadow: 0 -6px 40px ${({ theme }) => theme.secondary.clearer(0.2)};
`;

const Heading = styled.h2`
  text-align: center;
  font-weight: 200;
  font-size: 2.5rem;
  margin-top: 3rem;
  margin-bottom: 2rem;

  color: ${({ theme }) => theme.primary};
  text-shadow: 0 0 100px ${({ theme }) => theme.primary.clearer(0.4)};
`;

const SubHeading = styled.p`
  font-size: 1.25rem;

  text-align: center;

  line-height: 1.4;
  max-width: 40rem;

  color: rgba(255, 255, 255, 0.8);
`;

const Video = styled.video`
  transform: translateX(400px);
  height: 600px;
`;

export default class EditorFeatures extends React.Component {
  render() {
    return (
      <div>
        <Strobe />
        <MaxWidth width={1280}>
          <Centered horizontal>
            <Heading>Just like your local editor</Heading>
            <SubHeading>
              One of our goals is to make CodeSandbox feel like your local
              editor. We aim to give you the tools to build a full blown web
              application, like CodeSandbox. Say goodbye to the days where you
              wish you had your laptop with you to build out that great idea,
              you can continue on any device!
            </SubHeading>
          </Centered>

          <Margin top={2}>
            <Row alignItems="flex-start">
              <Column flex={1}>
                <Heading3>Editor</Heading3>
              </Column>
              <Column flex={3}>
                <Video controls src={autocompleteVideo} />
              </Column>
            </Row>
          </Margin>
        </MaxWidth>
      </div>
    );
  }
}
