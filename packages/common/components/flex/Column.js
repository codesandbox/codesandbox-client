import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;

  ${props => props.flex && `flex: ${props.flex}`};

  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
`;
