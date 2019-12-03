import styled, { css } from 'styled-components';
import { Button } from 'reakit/Button';
import { Link, Menu as BaseMenu } from '@codesandbox/common/lib/components';

export const Container = styled.div`
  min-width: 303px;
  border: 1px #242424 solid;
  border-radius: 4px;
  background-color: #151515;
`;

export const Preview = styled.img`
  width: 100%;
`;

export const SandboxInfo = styled.div`
  padding: 0.5rem 1rem 1rem 1rem;
`;

export const TitleRow = styled.div`
  display: flex;
`;

export const Title = styled.h1`
  flex: 1 1 auto;
  display: inline-flex;
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
`;

export const Menu = styled(BaseMenu)`
  flex: 0 0 auto;

  svg {
    color: #757575;
    font-size: 32px;

    &:hover,
    &:focus {
      color: #fff;
    }
  }
`;

export const Description = styled.p`
  color: #999;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
`;

const iconButton = css`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

export const Options = styled(Button)`
  ${iconButton}
`;

export const Statistics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto) 1fr;
  width: 100%;
`;

const stat = css`
  width: 80px;
  color: #757575;
  font-family: Inter;
  font-size: 0.8rem;

  svg {
    width: 18px;
    padding-right: 0.5rem;
    font-size: 1rem;
  }
`;

export const Action = styled(Button)`
  ${stat}
  ${iconButton}

  &:hover,
  &:focus {
    color: #fff;
  }
`;

export const Stat = styled.span`
  ${stat}
  display: flex;
  align-items: center;
`;

export const Environment = styled(Link)`
  justify-self: end;
`;
