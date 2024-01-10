import { Preference } from '@codesandbox/common/lib/components/Preference';
import styled, { css } from 'styled-components';

export const SubContainer = styled.div`
  width: 100%;

  div {
    &:first-child {
      padding-top: 0;
    }
  }
`;

export const PreferenceContainer = styled.div<{ disabled?: boolean }>`
  ${({ disabled }) => css`
    padding-top: 0.5rem;

    ${disabled &&
      css`
        opacity: 0.5;
        pointer-events: none;
        cursor: disabled;
      `}
  `};
`;

// Preference is typed in a bad way, not possible to infer
// correct values
export const PaddedPreference = styled<any>(Preference)`
  padding: 0;
  font-weight: 400;
`;

export const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 1rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;
