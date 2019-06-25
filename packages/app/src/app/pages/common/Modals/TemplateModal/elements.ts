import styled, { css, createGlobalStyle } from 'styled-components';
import CloseIcon from 'react-icons/lib/md/close';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import BaseShareIcon from 'react-icons/lib/md/share';

export const GlobalStylesTemplateModal = createGlobalStyle`
  .ReactModal__Content.ReactModal__Content--after-open {
    overflow: visible !important;
  }

  .ReactModal__Content h2 {
    margin-top: 0;
  }

  .sketch-picker {
      position: absolute;
      margin-top: 10px;
  }
`;

export const Container = styled.div`
  ${({ theme }) => css`
    padding: 1.5rem 2rem;
    margin: 0;
    border-radius: 8px;
    background-color: ${theme.background};
    color: rgba(255, 255, 255, 0.8);
  `}
`;

export const Title = styled.h2`
  ${({ theme }) => css`
    margin: 0;
    margin-bottom: 0.5rem;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'white'};
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 24px;
  `}
`;

export const Close = styled(CloseIcon)`
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
`;

const verticalSpacing = css`
  margin-top: 1rem;
`;

export const Description = styled.p`
  margin: 0;
  line-height: 1.4;
`;

export const TemplateName = styled(Input)`
  ${verticalSpacing}
`;

export const TemplateDescription = styled(TextArea)`
  ${verticalSpacing}
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  ${verticalSpacing}
`;

export const Label = styled.label`
  display: inline-block;
  margin-right: 1rem;
  cursor: pointer;
`;

export const DefaultColor = styled.button<{ color: string }>`
  ${({ color }) => css`
    position: relative;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: ${color};
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0;
    cursor: pointer;
  `}
`;

export const Actions = styled.div`
  ${({ single = false }) => css`
    display: flex;
    justify-content: ${single ? css`flex-end` : css`space-between`};
    align-items: center;
    ${verticalSpacing}
  `}
`;
