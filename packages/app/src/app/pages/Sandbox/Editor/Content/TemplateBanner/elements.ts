import styled from 'styled-components';

export const Container = styled.div`
  box-sizing: border-box;
  height: 66px;
  width: 100%;
  background: #0971f1;
  padding: 16px 13px;
  color: white;
  display: flex;
  justify-content: space-between;
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
  color: white;
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
    fill: #fff;
  }
`;

export const Close = styled.button`
  border: none;
  background: transparent;
  margin-left: 1rem;
  cursor: pointer;
`;
