import styled, { css } from 'styled-components';
import { Button } from 'reakit/Button';

export const Container = styled(Button)<{ ref?: any }>`
  display: inline-flex;
  width: 290px;
  padding: 0.5rem;
  margin: 0;
  border: none;
  box-shadow: 0px 1px 0px #242424;
  background: none;
  cursor: pointer;
  margin-bottom: 1rem;
`;

export const Icon = styled.div<{ color: string }>`
  ${({ color }) => css`
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 2px;
    background-color: ${color};
  `}
`;

export const Details = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin-left: 1rem;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.h2`
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 13px;
  line-height: 1rem;
  max-width: 165px;
  text-align: left;
  max-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Environment = styled.span`
  color: #fff;
  font-size: 11px;
  line-height: 13px;
`;

export const Author = styled.span`
  color: #757575;
  font-size: 11px;
  line-height: 13px;
`;
