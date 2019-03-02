import styled from 'styled-components';
import Preference from 'common/lib/components/Preference';

export const SubContainer = styled.div`
  color: ${props => props.theme.white};
  width: 100%;
  color: rgba(255, 255, 255, 0.8);

  div {
    &:first-child {
      padding-top: 0;
    }
  }
`;

export const Subheading = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin: 1rem 0;
  text-transform: uppercase;
`;

export const PreferenceContainer = styled.div`
  padding-top: 0.5rem;
`;

export const PaddedPreference = styled(Preference)`
  padding: 0;
  font-weight: 400;
`;

export const SubDescription = styled.div`
  margin-top: 0.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

export const Description = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  line-height: 1.4;
`;

export const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 1rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
`;

export const ContentContainer = styled.div`
  flex: 2;
  padding: 2rem;
`;

export const Title = styled.h2`
  font-weight: 500;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0 !important;
  margin-bottom: 2rem;

  text-transform: uppercase;
`;
