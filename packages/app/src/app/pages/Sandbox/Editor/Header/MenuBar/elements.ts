import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;

  position: fixed;
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
  }
`;

export const SkeletonMenuItem = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 4px 12px;
  zoom: 1;
  white-space: nowrap;
  border-radius: 2px;
  height: 38px;
  color: #999;
  font-size: 0.8125rem;
`;

export const SkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 38px;
  font-size: 0.8125rem;
  flex-shrink: 1;
  box-sizing: border-box;
  overflow: hidden;
  flex-wrap: wrap;
`;
