import styled from 'styled-components';

import media from '../utils/media';

export const Background = styled.div`
  background-image: linear-gradient(
    45deg,
    ${({ theme }) => theme.secondary.darken(0.1)()} 0%,
    ${({ theme }) => theme.secondary.darken(0.3)()} 100%
  );
`;

export const Heading = styled.h2`
  text-align: center;
  font-weight: 200;
  font-size: 2.5rem;
  margin-top: 6rem;
  margin-bottom: 1rem;

  text-transform: uppercase;

  color: ${({ theme }) => theme.primary};
  text-shadow: 0 0 100px ${({ theme }) => theme.primary.clearer(0.4)};

  ${media.phone`
  margin-top: 3rem;
  margin-bottom: 0;
`};
`;

export const SubHeading = styled.p`
  font-size: 1.25rem;

  text-align: center;
  font-weight: 400;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);

  line-height: 1.4;
  max-width: 40rem;

  color: rgba(255, 255, 255, 0.8);
`;

export const VisuallyHidden = styled.div`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;
