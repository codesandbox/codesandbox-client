import styled from 'styled-components';

export const Container = styled.div`
  box-sizing: border-box;
  height: 70px;
  width: 100%;
  background: ${props =>
    props.theme['editor.background'] || props.theme.background2};
  padding: 16px 13px;
  color: ${props => props.theme['editor.foreground'] || 'white'};
  display: flex;
  justify-content: space-between;
  z-index: 20;
  border-bottom: 1px solid
    ${props => props.theme['editorGroup.border'] || props.theme.background4};
`;

export const Side = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.span`
  font-family: 'Inter' sans-serif;
  font-weight: bold;
  font-size: 13px;
  line-height: 1rem;
  color: ${props => props.theme.light};
  display: block;
  margin-left: 0.5rem;
`;

export const Info = styled.span`
  font-family: 'Inter' sans-serif;
  font-size: 11px;
  line-height: 13px;
  margin-left: 0.5rem;

  color: ${props => props.theme.light};
  display: block;
`;

export const Icon = styled.div`
  border-radius: 4px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color};
`;

export const Counts = styled.ul`
  margin: 0;
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  font-size: 10px;
  align-items: center;
  margin-right: 1rem;

  li {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  svg {
    margin-right: 0.5rem;
    fill: currentColor;
  }
`;

export const Close = styled.button`
  border: none;
  background: transparent;
  margin-left: 1rem;
  cursor: pointer;
  color: currentColor;
`;
