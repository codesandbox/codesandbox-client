import { Button } from '@codesandbox/common/lib/components/Button';
import styled, { css } from 'styled-components';

export const Title = styled.h1`
  ${({ theme }) => css`
    font-weight: 600;
    font-size: 36px;
    margin-bottom: 2em;
    margin-top: 1em;
    padding-bottom: 0;
    color: ${theme.lightText};
  `};
`;

export const ContentBlock = styled.div`
  ${({ theme }) => css`
    h2 {
      font-weight: 600;
      font-size: 24px;
      margin-top: 36px;
      color: ${theme.lightText};
    }

    font-weight: 400;
    font-size: 18px;
    line-height: 1.5;
    color: ${theme.lightText};
    margin-bottom: 36px;
  `};
`;

export const ApplyButton = styled(Button)`
  display: inline-block;
  font-size: 14px;
  line-height: 1;
  margin-bottom: 50px;
`;
