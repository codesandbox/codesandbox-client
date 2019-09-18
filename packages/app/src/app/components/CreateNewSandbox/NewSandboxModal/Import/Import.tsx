import React, { useState } from 'react';
import { Button } from '../Button';
import { GitHubIcon, StackbitIcon } from '../Icons';
import { Header, Legend } from '../elements';
import {
  Features,
  Column,
  FeatureName,
  FeatureText,
  Input,
  ButtonContainer,
} from './elements';

export const Import = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <Header>
        <span>Import Project</span>
        <Legend>Show All</Legend>
      </Header>
      <Features>
        <Column>
          <FeatureName>
            <GitHubIcon />
            Import from GitHub
          </FeatureName>
          <FeatureText>
            Enter the URL to your GitHub repository to generate a URL to your
            sandbox. The sandbox will stay in sync with your repository.
            <small>
              Tip: you can also link to specific directories, commits and
              branches here.
            </small>
          </FeatureText>
          <form>
            <Input
              value={value}
              onChange={e => setValue(e.target.value)}
              type="text"
              placeholder="GitHub Repository URL..."
            />
            <ButtonContainer>
              <Button disabled={!value}>Copy Link</Button>
              <Button disabled={!value}>Generate Sandbox</Button>
            </ButtonContainer>
          </form>
        </Column>
        <Column>
          {' '}
          <FeatureName>
            <StackbitIcon />
            Import from Stackbit
          </FeatureName>
          <FeatureText>
            Create a project using Stackbit. This generates a project for you
            that's automatically set up with any Theme, Site Generator and CMS.
          </FeatureText>
          <Button>Generate Sandbox</Button>
        </Column>
      </Features>
    </>
  );
};
