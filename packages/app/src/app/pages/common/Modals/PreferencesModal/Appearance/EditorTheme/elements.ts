import { PreferenceText as PreferenceTextBase } from '@codesandbox/common/lib/components/Preference/PreferenceText';
import styled from 'styled-components';

export const BigTitle = styled.h2`
  font-weight: 600;
  color: white;
  font-size: 1rem;
  padding-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const PreferenceText = styled(PreferenceTextBase)`
  font-family: 'Source Code Pro';
  font-size: 0.8rem;
`;
