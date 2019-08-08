import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

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

export const Deploys = inject('store')(
  hooksObserver(({ store: { deployment: { sandboxDeploys } } }) => (
    <DeploysContainer>
      <WorkspaceSubtitle>Sandbox Deploys</WorkspaceSubtitle>

      <WorkspaceInputContainer>
        <DeploysWrapper>
          {sandboxDeploys.map(deploy => (
            <Deploy key={deploy.uid}>
              <Name>
                {deploy.name}

                <span>{`(${distanceInWordsToNow(deploy.created)} ago)`}</span>
              </Name>

              <State state={deploy.state}>{deploy.state.toLowerCase()}</State>

              {deploy.alias.length > 0 ? <Alias alias={deploy.alias} /> : null}

              <Actions deploy={deploy} />
            </Deploy>
          ))}
        </DeploysWrapper>
      </WorkspaceInputContainer>
    </DeploysContainer>
  ))
);
