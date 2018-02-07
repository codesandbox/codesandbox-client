import styled from 'styled-components';
import theme from 'common/theme';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 30;
`;

export const CodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 30;

  .jest-success {
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      content: '';
      width: 50%;
      height: 50%;
      background-color: ${theme.green()};
      border-radius: 50%;
    }
  }

  .jest-error {
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      content: '';
      width: 50%;
      height: 50%;
      background-color: ${theme.red()};
      border-radius: 50%;
    }
  }

  .margin-view-overlays {
    background: ${theme.background2()};
  }

  .monaco-editor.vs-dark .monaco-editor-background {
    background: ${theme.background2()};
  }

  .monaco-editor .view-overlays .current-line {
    border: none !important;
    background-color: rgba(23, 25, 27, 1);
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
  .mtk12.Identifier.JsxOpeningElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxExpression.JsxClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxClosingElement {
    color: #ec5f67 !important;
  }
  .mtk12.Identifier.JsxSelfClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.VariableStatement.JsxClosingElement {
    color: #ec5f67 !important;
  }
  .mtk12.VariableStatement.JsxSelfClosingElement.Identifier {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxAttribute.VariableDeclaration {
    color: #aa759f;
  }
  .mtk12.JsxExpression.VariableStatement {
    color: #fac863;
  }
  .mtk12.VariableStatement.JsxSelfClosingElement {
    color: #e0e0e0;
  }
  .mtk12.VariableStatement.JsxClosingElement {
    color: #e0e0e0;
  }
  .mtk12.JsxElement.JsxText {
    color: #e0e0e0;
  }
  .JsxText {
    color: #e0e0e0;
  }

  .Identifier.CallExpression
    + .OpenParenToken.CallExpression
    + .Identifier.CallExpression {
    color: #fac863 !important;
  }
`;
