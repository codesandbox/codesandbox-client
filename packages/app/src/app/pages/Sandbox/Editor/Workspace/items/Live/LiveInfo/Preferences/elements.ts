import styled, { css } from 'styled-components';

export const PreferencesContainer = styled.div`
  margin: 1rem;
  display: flex;
`;

export const Preference = styled.div`
  ${({ theme }) => css`
    flex: 1;
    font-weight: 400;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  `};
`;
