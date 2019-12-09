import styled, { css } from 'styled-components';
import { Link } from 'gatsby';
import RightArrow from 'react-icons/lib/md/keyboard-arrow-right';
import LeftArrow from 'react-icons/lib/md/keyboard-arrow-left';

export const Dots = styled.div`
  display: flex !important;
  position: relative;
  list-style: none;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
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
  color: ${props => props.theme.new.title};
  padding-top: 4rem;
  margin-bottom: 4rem;
`;

export const Sandboxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;

  /* accomodate for the margin of the sandboxes */
  margin: 0 -0.5rem;

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const ShowMore = styled.button`
  transition: 0.3s ease all;

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

export const Navigation = styled.div`
  position: relative;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  position: relative;
  list-style: none;
  align-items: center;
  justify-content: center;
`;

const ArrowStyles = css`
  transition: 0.3s ease color;
  font-size: 3em;
  height: 40px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  position: absolute;

  &:hover {
    color: ${props => props.theme.homepage.white};
  }
`;

export const StyledRightArrow = styled(RightArrow)`
  ${ArrowStyles};
  right: -40px;

  ${props =>
    props.disable &&
    css`
      opacity: 0.5;
      pointer-events: none;
      cursor: auto;
    `};
`;

export const StyledLeftArrow = styled(LeftArrow)`
  ${ArrowStyles};
  left: -40px;

  ${props =>
    props.disable &&
    css`
      opacity: 0.5;
      pointer-events: none;
      cursor: auto;
    `};
`;

export const PickedQuestion = styled(Link)`
  transition: 0.3s ease color;
  color: ${props => props.theme.new.description};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.new.title};
  }
`;
