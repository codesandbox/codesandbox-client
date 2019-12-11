import React from 'react';
import {
  Container,
  DeployAnimationContainer,
  StyledLocalLogo,
  StyledCube,
  StyledLogo,
  DeployText,
  Result,
} from './elements';

interface IUploadProgressProps {
  result: string;
  message: string;
}

export const UploadProgress: React.FC<IUploadProgressProps> = ({
  message,
  result,
}) => (
  <Container>
    {result ? (
      <Result>{result}</Result>
    ) : (
      <>
        <DeployAnimationContainer deploying>
          <StyledLocalLogo />
          {[0, 1, 2, 3].map(i => (
            <StyledCube key={i} delay={i} size={20} />
          ))}
          <StyledLogo width={70} height={70} />
        </DeployAnimationContainer>
        <DeployText>{message}</DeployText>
      </>
    )}
  </Container>
);
