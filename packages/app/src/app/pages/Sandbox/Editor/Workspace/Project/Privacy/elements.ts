import styled, { css } from 'styled-components';

export const PrivacyContainer = styled.span`
  ${({ theme }) => css`
    margin-bottom: 1rem;
    color: ${theme.templateColor};
    font-size: 0.875rem;
  `}
`;

export const PrivacySelect = styled.select`
  ${({ theme }) => css`
    width: 100%;
    /* Same size as other items */
    height: 20px;
    border: none;
    border-radius: 4px;
    background-color: ${theme[`dropdown.background`] || 'rgba(0, 0, 0, 0.3)'};
    box-sizing: border-box;
    color: ${theme[`dropdown.foreground`] ||
      (theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)')};

    &:disabled {
      opacity: 0.5;
    }
  `}
`;
