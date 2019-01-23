import styled from 'styled-components';
import Preference from 'common/components/Preference';

export const PaddedPreference = styled(Preference)`
  width: 100%;
  padding: 0;
  font-weight: 400;
`;

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

  color: rgba(255, 255, 255, 0.8);
`;

export const ConfigValue = styled.div``;

export const ConfigDescription = styled.div`
  margin-top: 0.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  max-width: 75%;
`;
