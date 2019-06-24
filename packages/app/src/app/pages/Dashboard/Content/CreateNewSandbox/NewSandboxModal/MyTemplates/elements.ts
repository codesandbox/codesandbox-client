import styled, { css } from 'styled-components';

export const MyTemplatesList = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow: auto;

  button:not(:last-child) {
    margin-right: 18px;
  }
`;
