import styled from 'styled-components';
import { PostContainer } from './_post.elements';

export const InfoContainer = styled(PostContainer)`
  section {
    height: 0;
    overflow: auto;
  }
`;

export const AirDate = styled.time`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #757575;
  display: block;
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

export const Audio = styled.iframe`
  position: fixed;
  bottom: 0;
  z-index: 999;
  left: 0;
  background-color: rgb(242, 242, 242);
  max-width: 100vw;
`;
