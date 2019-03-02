import styled from 'styled-components';

export default styled.div<{
  flex?: boolean;
  justifyContent: string;
  alignItems: string;
}>`
  display: flex;
  flex-direction: column;

  ${props => props.flex && `flex: ${props.flex}`};

  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
`;
