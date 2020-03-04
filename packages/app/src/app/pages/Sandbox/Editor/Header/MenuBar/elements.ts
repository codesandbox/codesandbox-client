import styled from 'styled-components';

export const Child = styled.div`
  align-items: center;
  height: 38px;
  font-size: 0.8125rem;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
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
