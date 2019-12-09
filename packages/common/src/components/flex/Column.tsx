import styled from 'styled-components';

export default styled.div<{
  flex?: boolean;
  justifyContent?: string;
  alignItems?: string;
}>`
  display: flex;
  flex-direction: column;

  ${props => props.flex && `flex: ${props.flex}`};

  ${props =>
    props.justifyContent && `justify-content: ${props.justifyContent}`};
  ${props => props.alignItems && `align-items: ${props.alignItems}`};
`;
