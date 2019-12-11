import { Link as LinkBase } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const Link = styled(LinkBase)`
  ${({ theme }) => css`
    color: ${theme.templateColor} !important;
  `}
`;
