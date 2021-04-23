import styled from 'styled-components';

const Container = styled.div`
  /* display: flex;
  align-items: center;
  margin-left: 0.5rem; */

  /* position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
  background: black;
  align-items: flex-start;

  .menu {
    width: 150px;
    position: relative;
  }

  .sub-menu {
    display: none;

    position: absolute;
    top: 0;
    left: 150px;

    z-index: 99999;
    background: #222;
    padding: 15px;
  }

  .menu:hover > .sub-menu {
    display: block;
  } */
`;

const MenuHandler = styled.button`
  background: none;
  border: 0;
  padding: 0;

  width: ${({ theme }) => theme.sizes[7]}px;
  height: ${({ theme }) => theme.sizes[7]}px;
  display: flex;

  color: ${({ theme }) => theme.colors.grays['300']};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.small}px;
  border: 1px solid transparent;
  transition: 0.3s ease border;

  margin-right: ${({ theme }) => theme.space[2]}px;
  margin-left: 5px;

  > * {
    margin: auto;
  }

  &:active,
  &:hover {
    outline: none;
    border-color: ${({ theme }) => theme.colors.grays['500']};
  }
`;

export { Container, MenuHandler };
