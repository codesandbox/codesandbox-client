import styled, { css } from 'styled-components';

export const TestDetails = styled.div`
  display: flex;
  flex: 1;
  margin-left: 1rem;
  font-size: 1rem;
`;

const baseTestStyles = css`
  display: inline-flex;
  font-weight: 500;
  margin-left: 0.75rem;
  align-items: center;
  font-size: 0.875rem;
`;

export const PassedTests = styled.div`
  ${baseTestStyles};
  color: ${props => props.theme.green};
`;

export const FailedTests = styled.div`
  ${baseTestStyles};
  color: ${props => props.theme.red};
`;

export const TotalTests = styled.div`
  ${baseTestStyles};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
`;

export const RightSide = styled.div`
  flex: 1;
  text-align: right;
`;
