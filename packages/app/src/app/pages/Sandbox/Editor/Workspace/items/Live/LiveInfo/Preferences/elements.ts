import styled, { css } from 'styled-components';

import { Theme } from '../types';

export const Preference = styled.div`
  ${({ theme }: Theme) => css`
    align-items: center;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    flex: 1;
    font-size: 0.875rem;
    font-weight: 400;
    justify-content: center;
  `}
`;

export const PreferencesContainer = styled.div`
  display: flex;
  margin: 1rem;
`;
