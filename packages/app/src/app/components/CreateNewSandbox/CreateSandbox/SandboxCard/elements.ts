import styled, { css } from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';
import { Link } from '@codesandbox/common/lib/components/Link';

export const ActionButton = styled(Button)`
  background: #151515;
  border: 1px solid #0971f1;
  box-sizing: border-box;
  border-radius: 2px;
  font-weight: 500;
  font-size: 9px;
  text-align: right;
  padding: 0 0.125rem !important;
  color: #0971f1;
  position: relative;
  z-index: 99;
  transition: opacity 500ms ease;
  opacity: 0;
`;

export const Container = styled(Link)<{ focused?: boolean }>`
  transition: 0.3s ease background-color;
  display: inline-flex;
  padding: 0.5rem;
  margin: 0;
  border: none;
  box-shadow: 0px 1px 0px #242424;
  background: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 2px;

  ${props =>
    props.focused &&
    css`
      background-color: #242424;
      outline: 0;
    `}

  &:focus,
  &:hover {
    background-color: #242424;
    outline: 0;

    ${ActionButton} {
      opacity: 1;
    }
  }
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
    /* background-color: ${color}; */
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
  align-items: center;
`;

export const Title = styled.span`
  padding: 0;
  margin: 0;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.125rem;
  font-size: 13px;
  line-height: 1rem;
  max-width: 155px;
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
