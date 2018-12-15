import styled from 'styled-components';

export const CLOSE_TIMEOUT_MS = 300;

export const BaseModal = styled.div`
  background-color: ${props => props.theme.background3};
`;

export const ModalTitle = styled.h1`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 1rem;
  margin: 0;
  font-size: 1.25rem;
  text-align: center;
  background-image: linear-gradient(-225deg, #31b0ff 0%, #47a8e5 100%);
`;

export const ModalBody = styled.div`
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.8);
`;
