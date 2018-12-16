import styled from 'styled-components';
import Preference from 'common/components/Preference';

export const FilesContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

export const PaddedPreference = styled(Preference)`
  color: rgba(255, 255, 255, 0.6);
  padding-bottom: 1rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const Container = styled.div`
  position: relative;
  height: 2rem;
  width: 200px;
  margin-left: -10px;
`;

export const ShareOptions = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  background-color: ${props => props.theme.background2};

  h3 {
    text-align: center;
    margin: 0;
    margin-bottom: 1rem;
    font-weight: 400;
  }
`;

export const Inputs = styled.div`
  margin-top: 0.5rem;
  input {
    border: none;
    outline: none;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.2rem;
    margin: 0.5rem 0;
    border-radius: 4px;
  }

  textarea {
    border: none;
    outline: none;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.2rem;
    margin: 0.5rem 0;
    height: 100px;
    border-radius: 4px;
  }
`;

export const LinkName = styled.div`
  margin: 0.5rem 0;
  font-weight: 400;
  margin-bottom: 0;
`;

export const Divider = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 100%;

  color: rgba(255, 255, 255, 0.8);
  margin: 0 0.75rem;

  h4 {
    margin: 1rem 0;
    font-weight: 400;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 0.25rem;
`;

export const ButtonName = styled.div`
  margin: 0.5rem 0;
  font-weight: 500;
  margin-bottom: 0;
`;
