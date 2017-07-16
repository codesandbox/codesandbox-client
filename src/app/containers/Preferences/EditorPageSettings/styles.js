import styled from 'styled-components';
import Preference from 'app/components/Preference';

export const Container = styled.div`
  color: ${props => props.theme.white};
  width: 100%;
  color: rgba(255, 255, 255, 0.8);

  div {
    &:first-child {
      padding-top: 0;
    }
  }
`;

export const PreferenceContainer = styled.div`padding-top: 0.5rem;`;

export const PaddedPreference = styled(Preference)`
padding: 0;
font-weight: 400;
`;

export const Description = styled.div`
  margin-top: 0.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: .875rem;
`;

export const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 1rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;
