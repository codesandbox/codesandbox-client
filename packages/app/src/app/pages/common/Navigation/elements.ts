import styled, { css } from 'styled-components';
import Logo from '@codesandbox/common/lib/components/Logo';
import RowBase from '@codesandbox/common/lib/components/flex/Row';

export const LogoWithBorder = styled(Logo)`
  padding-right: 1rem;
  color: white;
`;

export const Border = styled.hr`
  display: inline-block;
  height: 22px;
  width: 1px;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
`;

export const Title = styled.h1`
  margin-left: 1rem;
  font-size: 1.125rem;
  color: white;
  font-weight: 300;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
`;

export const Action = styled.div<{ noHover?: boolean }>`
  ${({ noHover }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease all;
    margin: 0 1rem;
    cursor: pointer;
    color: white;
    opacity: 0.8;
    background: transparent;
    border: none;
    padding: 0;

    ${noHover
      ? css`
          color: rgba(255, 255, 255, 0.8);
          opacity: 1;
        `
      : css`
          &:hover {
            opacity: 1;
          }
        `};
  `};
`;

export const UnreadIcon = styled.div`
  ${({ theme }) => css`
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${theme.secondary};

    top: 4px;
    right: 0;
  `};
`;

export const Row = styled(RowBase)<{ float?: boolean }>`
  ${({ float }) =>
    float &&
    css`
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      padding: 1rem;
    `};
`;

export const TitleWrapper = styled(RowBase)`
  position: relative;
  z-index: 10;
`;

export const Wrapper = styled(RowBase)`
  position: relative;
  z-index: 10;
  @media (max-width: 768px) {
    display: none;
  }
`;
