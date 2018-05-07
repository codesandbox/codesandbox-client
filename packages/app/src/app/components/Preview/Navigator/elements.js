import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  background-color: #f2f2f2;
  padding: 0.5rem;
  align-items: center;
  line-height: 1;
  box-shadow: 0 1px 3px #ddd;
  height: 2.5rem;
  min-height: 2.5rem;
  box-sizing: border-box;
`;

export const Icons = styled.div`
  display: flex;
`;

export const Icon = styled.button`
  display: inline-block;
  border: none;
  background-color: transparent;
  color: ${props =>
    props.disabled ? props.theme.gray : props.theme.gray.darken(0.3)};
  font-size: 1.5rem;
  line-height: 0.5;
  margin: 0 0.1rem;
  vertical-align: middle;
  text-align: center;
  padding: 0;
  outline: none;

  ${props =>
    !props.disabled &&
    `
    &:hover {
      background-color: #e2e2e2;
      cursor: pointer;
    }`};
`;

export const AddressBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0.5rem;
`;

export const SwitchContainer = styled.div`
  flex: 0 0 3.5rem;
`;
