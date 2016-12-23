import styled from 'styled-components';

export default styled.div`
  display: flex;
  ${props => props.horizontal && 'justify-content: center;'}
  ${props => props.vertical && 'align-items: center;'}
  flex-direction: column;
  width: 100%;
`;
