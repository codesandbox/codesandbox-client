import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  flex-direction: column;
  font-size: 0.875rem;

  color: ${props =>
    props.light || props.theme.light ? 'rgba(0, 0, 0)' : 'rgba(255, 255, 255)'};

  ${props =>
    props.loading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `};
`;

export const IntegrationBlock = styled.div`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  background-color: ${props => props.bgColor};
  flex: 1;
  color: white;
  padding: 0.75em 0.75em;
  min-height: 45px;
  font-size: 1em;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }
`;

export const Name = styled.span`
  margin-left: 0.75em;
  font-size: 1.375em;
  color: ${props => (props.light ? 'rgba(0, 0, 0)' : 'rgba(255, 255, 255)')};
`;
