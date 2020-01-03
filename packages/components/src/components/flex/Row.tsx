import styled from 'styled-components';

export default styled.div<{ justifyContent?: string; alignItems?: string }>`
  display: flex;
  flex-direction: row;

  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'center'};
`;
