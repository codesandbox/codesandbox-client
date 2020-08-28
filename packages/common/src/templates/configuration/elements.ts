import styled from 'styled-components';

import { Preference } from '../../components/Preference';

export const PaddedPreference = (styled(Preference)`
  width: 100%;
  padding: 0;
  font-weight: 400;

  input[type='checkbox']:focus {
    display: none;
  }
` as unknown) as typeof Preference;

export const PaddedConfig = styled.div`
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ConfigItem = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ConfigName = styled.span`
  flex: 1;
  font-weight: 400;

  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
`;

export const ConfigValue = styled.div``;

export const ConfigDescription = styled.div`
  margin-top: 0.25rem;
  font-weight: 500;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  opacity: 0.8;
  font-size: 0.875rem;
  max-width: 75%;
`;
