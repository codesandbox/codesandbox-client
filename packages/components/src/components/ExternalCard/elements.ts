import styled from 'styled-components';
import { Stack } from '../Stack';
import { Text } from '../Text';

export const StyledWrapper = styled(Stack)<{ thumbnail: string }>`
  position: relative;
  overflow: hidden;
  height: 156px;
  width: 276px;
  background: #999999;
  border-radius: 4px;

  &:after {
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
    transition: transform linear;
    transition-duration: 200ms;
  }

  &:hover::after {
    transform: scale(1.02);
  }
`;
StyledWrapper.defaultProps = {
  direction: 'vertical',
};

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
  margin: auto 24px 24px;
`;
StyledDetails.defaultProps = {
  align: 'center',
  gap: 3,
  justify: 'space-between',
};

export const StyledTitle = styled(Text)<{ clamp?: boolean }>`
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
StyledTitle.defaultProps = {
  as: 'p',
  clamp: true,
};
