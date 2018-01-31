import styled, { css } from 'styled-components';

export const TestTitle = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;

  margin-left: -0.25rem;
  width: calc(100% + 0.25rem);

  padding: 1rem;
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
  color: rgba(255, 255, 255, 0.5);
`;

export const RightSide = styled.div`
  flex: 1;
  text-align: right;
`;

export const ProgressBar = styled.div`
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  height: 3px;
  width: 100%;
  overflow: hidden;
  border-radius: 1px;
  margin-top: -1px;
`;

const baseBarStyles = css`
  transition: 0.3s ease all;
  border-radius: 1px;
  height: 3px;
  flex: ${props => props.count};
  margin: 0 ${props => (props.count !== 0 ? 3 : -3)}px;

  &:first-child {
    margin-left: 0rem;
  }

  &:last-child {
    margin-right: 0;
  }
`;

export const SuccessBar = styled.div`
  ${baseBarStyles};
  background-color: ${props => props.theme.green};
`;

export const FailedBar = styled.div`
  ${baseBarStyles};
  background-color: ${props => props.theme.red};
`;

export const IdleBar = styled.div`
  ${baseBarStyles};
  background-color: rgba(255, 255, 255, 0.5);
`;

export const Tests = styled.div`
  padding: 1rem;
`;
