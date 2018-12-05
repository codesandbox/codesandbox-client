import styled, { css } from 'styled-components';

export const Dots = styled.div`
  display: flex !important;

  list-style: none;
  align-items: center;
  justify-content: center;

  margin: 0 auto;
  margin-top: 30px;
`;

export const DotContainer = styled.div`
  height: 16px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Dot = styled.button`
  transition: 0.3s ease all;
  border-radius: 100%;

  width: 8px;
  height: 8px;
  border: 0;
  outline: 0;
  padding: 0;

  background-color: ${props => props.color};
  cursor: pointer;

  ${props =>
    props.active
      ? css`
          width: 12px;
          height: 12px;
        `
      : css`
          &:hover {
            width: 12px;
            height: 12px;
          }
        `};
`;

export const Container = styled.div`
  color: ${props => props.theme.new.title}

  margin-bottom: 4rem;
`;

export const Sandboxes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  /* accomodate for the margin of the sandboxes */
  margin: 0 -0.5rem;
`;

export const ShowMore = styled.button`
  transition: 0.3s ease all;
  font-family: 'Poppins';

  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${props => props.theme.new.title};
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;

  cursor: pointer;

  ${props =>
    props.disable
      ? css`
          cursor: auto;
          background-color: rgba(0, 0, 0, 0.1);
        `
      : css`
          &:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }
        `};
`;
