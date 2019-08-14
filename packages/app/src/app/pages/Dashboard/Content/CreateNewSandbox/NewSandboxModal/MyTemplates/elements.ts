import styled from 'styled-components';

export const MyTemplatesList = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow: auto;
  /* We do this to remove a scrollbar when there are 4 children */
  width: calc(100% + 11px);

  button:not(:last-child) {
    margin-right: 1rem;
  }
`;
