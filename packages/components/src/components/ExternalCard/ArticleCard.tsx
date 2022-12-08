import React from 'react';
import { Icon } from '../Icon';
import {
  StyledContent,
  StyledDetails,
  StyledTitle,
  StyledWrapper,
} from './elements';

type Article = {
  title: string;
  thumbnail: string;
  url: string;
};

type ArticleCardProps = { onClick?: () => void } & Article;

export const ArticleCard: React.FC<ArticleCardProps> = ({
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
          <StyledTitle clamp>{title}</StyledTitle>
          <Icon
            css={{
              color: '#999999',
              transform: 'rotate(270deg)',
            }}
            name="arrowDown"
          />
        </StyledDetails>
      </StyledContent>
    </StyledWrapper>
  );
};
