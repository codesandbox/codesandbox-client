import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  background-color: ${props =>
    props.theme['editor.background'] || props.theme.background()};
  padding: 0.25rem;
  align-items: center;
  line-height: 1;
  /* box-shadow: 0 1px 3px #ddd; */
  height: 35px;
  min-height: 35px;
  box-sizing: border-box;
  z-index: 2;
`;

export const Icons = styled.div`
  display: flex;
`;

export const Icon = styled.button<{ moduleView?: boolean; disabled?: boolean }>`
  display: inline-block;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  line-height: 0.5;
  margin: 0 0.25rem;
  vertical-align: middle;
  text-align: center;
  padding: 0;
  outline: none;
  cursor: pointer;
  transition: 0.2s ease color;

  color: ${({ theme }) => theme?.['titleBar.inactiveForeground']};

  &:hover {
    color: ${({ theme }) => theme?.['titleBar.activeForeground']};
  }

  ${({ moduleView, disabled }) =>
    !moduleView &&
    disabled &&
    css`
      cursor: default;
      opacity: 0.4;
    `};
`;

export const IconWithBackground = styled(Icon)`
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) =>
    theme['input.background'] || theme.background()};
`;

export const AddressBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0.25rem;
`;
