import React from "react"
import { Container, HeroImage } from "./elements"

interface IFeaturedSandboxProps {
  heroImage: string
}

export const FeaturedSandbox: React.FC<IFeaturedSandboxProps> = ({
  heroImage
}) => { // eslint-disable-line
	// TODO:
	// - Make Hero Image a Live Sandbox Preview?
  return (
    <Container>
      <HeroImage src={heroImage} />
    </Container>
  )
}
