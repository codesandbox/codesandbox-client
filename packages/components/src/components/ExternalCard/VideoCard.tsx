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
  title: string;
  thumbnail: string;
  url: string;
};

type VideoCardProps = { onClick?: () => void } & Video;

export const VideoCard: React.FC<VideoCardProps> = ({
  duration,
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
        <StyledDetails>
          <Stack
            align="center"
            css={{
              flexShrink: 0,
              height: '32px',
              width: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(2.68809px)',
            }}
            justify="center"
          >
            <Icon name="start" />
          </Stack>
          <StyledTitle>{title}</StyledTitle>
          <StyledTitle clamp={false}>{duration}</StyledTitle>
        </StyledDetails>
      </StyledContent>
    </StyledWrapper>
  );
};
