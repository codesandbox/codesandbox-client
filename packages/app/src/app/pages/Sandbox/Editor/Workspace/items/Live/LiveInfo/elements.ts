import styled, { css } from 'styled-components';
import Input from '@codesandbox/common/lib/components/Input';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';

interface Theme {
  theme: {
    light: boolean;
  };
}

export const Container = styled.div`
  ${({ theme }: Theme) => css`
    ${delay()};
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    box-sizing: border-box;
  `}
`;

export const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  vertical-align: middle;
  padding: 0.5rem 1rem;
  padding-top: 0;

  svg {
    margin-right: 0.25rem;
  }
`;

export const ConnectionStatus = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 1rem;
`;

export const StyledInput = styled(Input)`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem;
  font-size: 0.875rem;
`;

export const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  padding-left: 1rem;
  font-size: 0.875rem;
`;

export const Users = styled.div`
  ${({ theme }: Theme) => css`
    padding: 0.25rem 1rem;
    padding-top: 0;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
  `}
`;

export const ModeSelect = styled.div`
  position: relative;
  margin: 0.5rem 1rem;
`;

export const Mode = styled.button`
  ${({ onClick, selected }: { onClick: any; selected: boolean }) => css`
    display: block;
    text-align: left;
    transition: 0.3s ease opacity;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 4px;
    width: 100%;
    font-size: 1rem;

    font-weight: 600;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: ${onClick ? 'pointer' : 'inherit'};
    color: white;
    opacity: ${selected ? 1 : 0.6};
    margin: 0.25rem 0;

    z-index: 3;

    ${onClick &&
      `
  &:hover {
    opacity: 1;
  }`};
  `}
`;

export const ModeDetails = styled.div`
  ${({ theme }: Theme) => css`
    font-size: 0.75rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    margin-top: 0.25rem;
  `}
`;

export const ModeSelector = styled.div`
  ${({ i }: { i: number }) => css`
    transition: 0.3s ease transform;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 48px;

    border: 2px solid rgba(253, 36, 57, 0.6);
    background-color: rgba(253, 36, 57, 0.6);
    border-radius: 4px;
    z-index: -1;

    transform: translateY(${i * 55}px);
  `}
`;

export const PreferencesContainer = styled.div`
  margin: 1rem;
  display: flex;
`;

export const Preference = styled.div`
  ${({ theme }: Theme) => css`
    flex: 1;
    font-weight: 400;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  `}
`;

export const IconContainer = styled.div`
  ${({ theme }: Theme) => css`
    transition: 0.3s ease color;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    cursor: pointer;

    &:hover {
      color: white;
    }
  `}
`;

export const NoUsers = styled.div`
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
`;
