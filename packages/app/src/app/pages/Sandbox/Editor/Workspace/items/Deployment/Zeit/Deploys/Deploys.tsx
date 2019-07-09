import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import React from 'react';

import { useStore } from 'app/store';

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

export const Deploys = () => {
  const {
    deployment: { sandboxDeploys },
  } = useStore();

  return (
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

              {deploy.alias.length ? (
                <span>
                  Aliased to{' '}
                  {deploy.alias.map(a => (
                    <a
                      href={`https://${a.alias}`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {a.alias}
                    </a>
                  ))}
                </span>
              ) : null}

              <Actions deploy={deploy} />
            </Deploy>
          ))}
        </DeploysWrapper>
      </WorkspaceInputContainer>
    </DeploysContainer>
  );
};
