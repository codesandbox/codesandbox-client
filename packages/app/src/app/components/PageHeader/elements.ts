import styled, { css } from 'styled-components';
import { Group } from 'reakit/Group';
import {
  Link as BaseLink,
  Button as BaseButton,
} from '@codesandbox/common/lib/components';

export const Container = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0px 2rem;
  box-sizing: border-box;
`;

export const Content = styled.nav`
  display: flex;
  align-items: space-between;
  width: 100%;
  max-width: 1280px;
  color: white;
  padding: 1rem 0px;
`;

export const Left = styled(Group)`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
`;

export const Home = styled(BaseLink)`
  display: inline-flex;
  margin-right: 1rem;
  color: white;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    color: rgb(64, 169, 243);
  }
`;

export const Separator = styled.hr`
  display: inline-flex;
  height: 22px;
  width: 1px;
  margin: 0;
  border-style: none solid none none;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
`;

export const Link = styled(BaseLink)`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    padding: 0 0.5rem;
    margin: 0 0.5rem;
    color: white;
    ${theme.fonts.primary.medium};
    transition: color 0.2s ease 0s;
    text-decoration: none;

    &:focus {
      outline: none;
    }

    &:hover,
    &:focus {
      color: rgb(64, 169, 243);
    }
  `}
`;

export const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0;
  border: none;
  border-left: 2px solid transparent;
  background: none;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease 0s;

  &:focus {
    outline: none;
  }

  &:hover,
  &:focus {
    border-color: rgb(64, 169, 243);
    background-color: rgba(64, 169, 243, 0.098);
    color: white;
  }
`;

export const Right = styled(Group)`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
`;

export const Button = styled(BaseButton)`
  flex: 0 0 auto;
  width: initial;

  &:not(:first-child) {
    margin-left: 1rem;
  }
`;
