import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  grid-area: avatar;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68px;
  height: 68px;
`;

export const ProfilePicture = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  border: 1px #242424 solid;
  border-radius: 4px;

	transition: filter 0.1s linear;

  &:hover {
    filter: brightness(120%);
  }
`;

const badge = css`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 14px;
  border-radius: 1px;
  font-family: Inter;
  font-size: 11px;
  font-weight: bold;
  user-select: none;

  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 34px;
    height: 14px;
    border: 1px #151515 solid;
    border-radius: 1px;
  }
`;

export const TeamBadge = styled.span`
  ${badge}
  background-color: #BF5AF2;
  color: #000;
`;

export const PatronBadge = styled.span`
  ${badge}
  background-color: #5BC266;
  color: #000;
`;

export const ProBadge = styled.span`
  ${badge}
  background-color: #535BCF;
  color: #fff;
`;
