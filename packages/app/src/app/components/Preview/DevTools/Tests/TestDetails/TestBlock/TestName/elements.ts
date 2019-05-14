import styled from 'styled-components';

export const Block = styled.div<{ last: boolean }>`
  display: flex;
  padding: 0.5rem 0.4rem;
  padding-left: 0.5rem;
  position: relative;
  margin-right: ${props => (props.last ? 0 : 12)}px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};

  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    margin: auto;
    top: 13px;
    right: -10px;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    border-right: 1px solid
      ${props =>
        props.theme.light
          ? `rgba(0, 0, 0, ${props.last ? 0.3 : 0.4})`
          : `rgba(255, 255, 255, ${props.last ? 0.3 : 0.4})`};
    border-top: 1px solid
      ${props =>
        props.theme.light
          ? `rgba(0, 0, 0, ${props.last ? 0.3 : 0.4})`
          : `rgba(255, 255, 255, ${props.last ? 0.3 : 0.4})`};
    background-color: rgba(0, 0, 0, 0.01);
    z-index: 1;
  }
`;

export const TestName = styled.div`
  padding: 0.4rem;
  padding-left: 20px;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  flex: auto;
  white-space: nowrap;
`;
