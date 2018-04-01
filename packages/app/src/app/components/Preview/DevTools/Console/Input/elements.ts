import styled from 'app/styled-components';

export const CONSOLE_INPUT_TOP_PADDING = 6;
export const CONSOLE_INPUT_BOTTOM_PADDING = 6;

export const Input = styled.input`
    position: relative;
    height: 1.5rem;
    width: 100%;
    background-color: ${(props) => props.theme.background.darken(0.3)};
    border: none;
    outline: none;
    color: rgba(255, 255, 255, 0.8);
    font-family: Menlo, monospace;
    font-size: 13px;
`;

export const IconContainer = styled.div`
    display: inline-flex;
    padding: 0.5rem 0;
    width: 24px;
    align-items: center;
    justify-content: center;
`;

export const InputWrapper = styled.div`
    position: relative;
    height: 100%;
    padding-top: ${CONSOLE_INPUT_TOP_PADDING}px;
    padding-bottom: ${CONSOLE_INPUT_BOTTOM_PADDING}px;
    box-sizing: border-box;
    width: 100%;
`;

export const Container = styled<
    {
        height: number;
    },
    'div'
>('div')`
  flex-shrink: 0;
  position: relative;
  height: ${(props) => props.height}px;
  min-height: 2rem;
  max-height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.background.darken(0.3)};
  display: flex;
  align-items: flex-start;

  .monaco-editor-background {
    background-color: ${(props) => props.theme.background.darken(0.3)};
  }

  .react-monaco-editor-container {
    overflow: visible !important;
  }

  .mtk5 {
    color: #99c794 !important;
  }
  .mtk12.PropertyAssignment {
    color: #99c794;
  }
  .mtk12.PropertyAssignment.PropertyAccessExpression {
    color: #fac863;
  }
  .Identifier.CallExpression
    + .OpenParenToken.CallExpression
    + .Identifier.CallExpression {
    color: #fac863 !important;
  }
`;
