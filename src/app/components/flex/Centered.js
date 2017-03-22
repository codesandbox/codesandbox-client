import styled from 'styled-components';

export default styled.div`
  position: relative;
  display: flex;
  ${props => props.horizontal && 'justify-content: center;'}
  ${props => props.vertical && 'align-items: center;'}
  flex-direction: column;
  width: 100%;
`;
