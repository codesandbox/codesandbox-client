import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  WorkspaceInputContainer,
  WorkspaceSubtitle,
} from '../../../../elements';

import {
  Deploy,
  Deploys as DeploysWrapper,
  DeploysContainer,
  Name,
  State,
} from '../../elements';

import { Actions } from './Actions';
import { Alias } from './Alias';

export const Deploys: FunctionComponent = () => {
  const {
    state: {
      deployment: { sandboxDeploys },
    },
  } = useOvermind();

  return (
    <DeploysContainer>
      <WorkspaceSubtitle>Sandbox Deploys</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <DeploysWrapper>
          {sandboxDeploys.map(deploy => (
            <Deploy key={deploy.uid}>
              <Name>
                {deploy.name}

                <span>{`(${formatDistanceToNow(deploy.created)} ago)`}</span>
              </Name>

              <State state={deploy.state}>
                {deploy.state.toString().toLowerCase()}
              </State>

              {deploy.alias.length > 0 ? <Alias alias={deploy.alias} /> : null}

              <Actions deploy={deploy} />
            </Deploy>
          ))}
        </DeploysWrapper>
      </WorkspaceInputContainer>
    </DeploysContainer>
  );
};
