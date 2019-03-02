import styled from 'styled-components';

export const TestTitle = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;

  margin-left: -0.25rem;
  width: calc(100% + 0.25rem);

  padding: 1rem;
`;

export const Action = styled.div`
  transition: 0.3s ease opacity;
  margin-left: 0.5rem;
  font-size: 1.125rem;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:last-child {
    margin-right: 0.25rem;
  }
`;

export const ErrorNotice = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
`;

export const TestName = styled.span`
  font-weight: 400;
  font-size: 1rem;
  color: white;
  margin: 0;
  margin-top: 0;
  margin-bottom: 0;
`;

export const Blocks = styled.span`
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
`;

export const Tests = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: overlay;
  height: calc(100% - 4rem);
`;
