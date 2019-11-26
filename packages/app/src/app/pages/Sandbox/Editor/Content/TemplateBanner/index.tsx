import React from 'react';
import { LightIcons } from '@codesandbox/template-icons';
import getLightIcons from '@codesandbox/common/lib/templates/iconsLight';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { Sandbox } from '@codesandbox/common/lib/types';
import { Container, Title, Info, Side, Counts, Icon, Close } from './elements';
import { FollowTemplateButton } from '../../Workspace/Project/FollowTemplateButton';

interface ITemplateBannerProps {
  sandbox: Sandbox;
  hideBanner: () => void;
}

export const TemplateBanner = ({
  sandbox,
  hideBanner,
}: ITemplateBannerProps) => {
  const { customTemplate } = sandbox;
  const environment = getTemplateDefinition(sandbox.template);
  const UserIcon: React.FunctionComponent =
    LightIcons[customTemplate.iconUrl] || getLightIcons(customTemplate.iconUrl);

  return (
    <Container>
      <Side>
        {UserIcon ? (
          <Icon color={customTemplate.color}>
            <UserIcon />
          </Icon>
        ) : null}
        <div>
          <Title>{customTemplate.title}</Title>
          <Info>{environment.niceName}</Info>
          {sandbox.author && <Info>By {sandbox.author.username}</Info>}
        </div>
      </Side>
      <Side>
        <Counts color={customTemplate.color}>
          <li>
            <svg width="16" height="14" viewBox="0 0 16 14">
              <path d="M7.88822 14C21.8974 6.50193 14.9693 -3.70201 7.88823 1.35226C1.11292 -3.70201 -5.81528 6.50192 7.88822 14Z" />
            </svg>

            {sandbox.likeCount}
          </li>
          <li>
            <svg
              css={`
                width: 20px;
                height: 14px;
              `}
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 7c0 2-6.134 7-10 7C6.134 14 0 8.5 0 7c0-2 6.134-7 10-7 3.866 0 10 5 10 7zm-6 0a4 4 0 11-8 0 4 4 0 018 0zm-4 2a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            {sandbox.viewCount}
          </li>
          <li>
            <svg
              css={`
                width: 16.8px;
                height: 15.98px;
              `}
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M.546 6.736a1.711 1.711 0 000 2.506l6.537 6.217a1.932 1.932 0 002.635 0l6.536-6.217a1.711 1.711 0 000-2.506L9.718.519a1.932 1.932 0 00-2.635 0L.546 6.736zm10.452-.513l-2.49-2.796-2.49 2.796H7.74c-.18 2.274-.836 3.174-1.382 3.55-.577.398-1.186.374-1.767.35-.134-.005-.266-.01-.397-.01v1.492c.053 0 .125.004.213.009.55.032 1.731.1 2.746-.598.542-.373 1.005-.926 1.355-1.715.35.789.812 1.342 1.354 1.715 1.015.699 2.195.63 2.747.598.088-.005.16-.01.212-.01v-1.49c-.13 0-.263.004-.397.01-.58.023-1.19.047-1.766-.35-.547-.377-1.202-1.277-1.383-3.55h1.723z"
              />
            </svg>
            {sandbox.forkCount}
          </li>
        </Counts>
        <FollowTemplateButton />
        <Close onClick={() => hideBanner()}>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path
              d="M8 0.727277L7.27273 4.98512e-06L4 3.27273L0.727273 0L0 0.727273L3.27273 4L0 7.27273L0.727272 8L4 4.72727L7.27273 8L8 7.27273L4.72727 4L8 0.727277Z"
              fill="currentColor"
            />
          </svg>
        </Close>
      </Side>
    </Container>
  );
};
