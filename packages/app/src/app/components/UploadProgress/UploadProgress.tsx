import React from 'react';
import { Element, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import {
  UploadAnimationContainer,
  StyledLocalLogo,
  StyledCube,
  StyledLogo,
} from './elements';

interface IUploadProgressProps {
  result?: string;
  message: string;
}

export const UploadProgress: React.FC<IUploadProgressProps> = ({
  message,
  result,
}) => (
  <Element padding={4} paddingTop={6}>
    {result ? (
      <Text marginBottom={4} size={3} block>
        {result}
      </Text>
    ) : (
      <>
        <UploadAnimationContainer>
          <StyledLocalLogo
            css={css({
              backgroundColor: 'sideBar.background',
              color: 'sideBar.foreground',
            })}
          />
          {[0, 1, 2, 3].map(i => (
            <StyledCube key={i} delay={i} size={20} />
          ))}
          <StyledLogo width={70} height={70} />
        </UploadAnimationContainer>
        <Text align="center" weight="bold" block size={4} marginTop={4}>
          {message}
        </Text>
      </>
    )}
  </Element>
);
