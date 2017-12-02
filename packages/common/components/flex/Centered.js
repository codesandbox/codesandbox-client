import styled from 'styled-components';

export default styled.div`
  position: relative;
  display: flex;
  ${props => props.vertical && 'justify-content: center;'} ${props =>
      props.horizontal && 'align-items: center;'} flex-direction: column;
  width: 100%;
`;
