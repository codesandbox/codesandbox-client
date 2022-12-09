import React from 'react';
import { Icon } from '../Icon';
import { Stack } from '../Stack';
import {
  StyledContent,
  StyledDetails,
  StyledTitle,
  StyledWrapper,
} from './elements';

type Video = {
  duration: string;
  durationLabel: string;
  title: string;
  thumbnail: string;
  url: string;
};

type VideoCardProps = { onClick?: () => void } & Video;

export const VideoCard: React.FC<VideoCardProps> = ({
  duration,
  durationLabel,
  title,
  thumbnail,
  url,
  ...props
}) => {
  return (
    <StyledWrapper
      as="a"
      direction="vertical"
      href={url}
      target="_blank"
      thumbnail={thumbnail}
      {...props}
    >
      <StyledContent>
        <StyledDetails gap={3}>
          <Stack
            align="center"
            css={{
              padding: '8px',
              flexShrink: 0,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(2.68809px)',
            }}
            justify="center"
          >
            <Icon css={{}} name="start" />
          </Stack>
          <StyledTitle clamp>{title}</StyledTitle>
          <StyledTitle aria-label={durationLabel} clamp={false}>
            {duration}
          </StyledTitle>
        </StyledDetails>
      </StyledContent>
    </StyledWrapper>
  );
};
