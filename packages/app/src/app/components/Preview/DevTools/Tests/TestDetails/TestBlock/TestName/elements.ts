import styled from 'styled-components';

export const Block = styled.div`
  transition: 0.3s ease color;
  display: flex;
  padding: 0.5rem 0.4rem;
  padding-left: 0.5rem;
  position: relative;
  margin-right: ${props => (props.last ? 0 : 12)}px;
  color: rgba(255, 255, 255, 0.5);

  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    margin: auto;
    top: 5px;
    right: -10px;
    width: 24px;
    height: 24px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    border-right: 1px solid rgba(0, 0, 0, ${props => (props.last ? 0.3 : 0.4)});
    border-top: 1px solid rgba(0, 0, 0, ${props => (props.last ? 0.3 : 0.4)});
    background-color: #181b1d;
    z-index: 1;
  }
`;

export const TestName = styled.div`
  transition: 0.3s ease background-color;
  padding: 0.4rem;
  padding-left: 20px;
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.8);
  flex: auto;
  white-space: nowrap;
`;
