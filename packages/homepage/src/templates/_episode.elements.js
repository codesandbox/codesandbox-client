import styled from 'styled-components';

export const Description = styled.span`
  font-size: 1.1rem;
  line-height: 1.6rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.75);
  padding: 0;
`;

export const AirDate = styled.time`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #757575;
`;

export const IMG = styled.img`
  width: 64px;
  border-radius: 2px;
  margin-right: 16px;
`;

export const GuestInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EpisodeNumber = styled.span`
  font-weight: 900;
  font-size: 33px;
  line-height: 44px;
  color: #ffffff;
  margin-bottom: 16px;
`;

export const Audio = styled.iframe`
  position: fixed;
  bottom: 0;
  z-index: 999;
  left: 0;
  background-color: rgb(242, 242, 242);
  max-width: 100vw;
`;
