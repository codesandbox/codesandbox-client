import styled from 'styled-components';
import { Stack } from '../Stack';
import { Text } from '../Text';

export const StyledWrapper = styled(Stack)<{ thumbnail: string }>`
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #1d1d1d;
  outline: none;
  border-radius: 4px;
  border: 1px solid #1d1d1d;
  transition: background ease-in-out;
  transition-duration: ${props => props.theme.speeds[2]};

  :after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url(${props => props.thumbnail});
    background-size: cover;
    background-position: center;
    transform: scale(1);
    transition: transform ease-in-out;
    transition-duration: ${props => props.theme.speeds[2]};
  }

  :hover {
    background-color: #292929;
  }

  :hover::after,
  :focus::after {
    transform: scale(1.02);
  }

  :focus-visible {
    border-color: #9581ff;
  }
`;

export const StyledContent = styled(Stack)`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  background: linear-gradient(
      0deg,
      rgba(25, 25, 25, 0.3) 0%,
      rgba(25, 25, 25, 0) 100%
    ),
    linear-gradient(0deg, rgba(25, 25, 25, 0.6) 0%, rgba(25, 25, 25, 0) 100%),
    linear-gradient(0deg, rgba(25, 25, 25, 0.8) 0%, rgba(25, 25, 25, 0) 100%);
`;

export const StyledDetails = styled(Stack)`
  width: 100%;
  margin: auto 24px 24px;
  align-items: center;
  justify-content: space-between;
`;

export const StyledTitle = styled(Text)<{ clamp: boolean }>`
  margin: 0;
  color: #ebebeb;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;

  ${props =>
    props.clamp &&
    `  
  width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  `}
`;
