import React from 'react';
import IssueIcon from 'react-icons/lib/go/issue-opened';
import { Sadbox } from './Sadbox';
import { IFallbackComponentProps } from '../types';
import { buildCrashReport } from './buildCrashReport';
import { Container, Title, Subtitle, Actions, IssueLink } from './elements';

export const CodeSadbox = ({ error, trace }: IFallbackComponentProps) => {
  return (
    <Container>
      <Title>Oh no! You broke it!</Title>
      <Subtitle>CodeSadbox</Subtitle>
      <Sadbox scale={2} />
      <Actions>
        <IssueLink href={buildCrashReport({ error, trace })}>
          <IssueIcon />
          Report Crash
        </IssueLink>
      </Actions>
    </Container>
  );
};
