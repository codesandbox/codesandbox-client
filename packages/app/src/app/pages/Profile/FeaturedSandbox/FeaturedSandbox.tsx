import React from 'react';
// import { SandboxOptionsMenu } from "../SandboxOptionsMenu";
import { Container, HeroImage } from './elements';

interface IFeaturedSandboxProps {
  id: string;
}

export const FeaturedSandbox: React.FC<IFeaturedSandboxProps> = ({
  id,
}) => {
  // eslint-disable-line
  // TODO:
  // - Make Hero Image a Live Sandbox Preview?
  return (
    <Container>
      <HeroImage src={`/api/v1/sandboxes/${id}/screenshot.png`} />
    </Container>
  );
};
