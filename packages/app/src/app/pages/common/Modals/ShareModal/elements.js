import styled from 'styled-components';
import Preference from 'common/lib/components/Preference';

export const FilesContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

export const PaddedPreference = styled(Preference)`
  color: #e5e5e5;
  padding-bottom: 1rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const ShareOptions = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  background-color: #1c2022;
`;

export const Inputs = styled.div`
  margin-top: 0.5rem;
  color: #e5e5e5;

  input,
  textarea {
    border: none;
    outline: none;
    background: #333739;
    color: #e5e5e5;
    padding: 0.2rem;
    margin: 0.5rem 0;
    border-radius: 4px;
    width: 100%;
  }

  textarea {
    height: 100px;
  }
`;

export const LinkName = styled.div`
  margin: 0.5rem 0;
  font-weight: 400;
  margin-bottom: 0;
`;

export const ButtonContainer = styled.div`
  margin-top: 0.25rem;
`;

export const Title = styled.h4`
  font-family: 'Roboto';
  font-weight: 500;
  font-size: 18px;
  padding-bottom: 20px;
  margin: 0;
  padding-top: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

export const Wrapper = styled.section`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(2, 1fr);
`;

export const SideTitle = styled.span`
  font-family: 'Poppins';
  font-weight: bold;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 15px;
  color: #e5e5e5;
  display: block;
`;
