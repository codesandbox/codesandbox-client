import styled from 'styled-components';

export const TemplatesGrid = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;
