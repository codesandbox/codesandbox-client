import styled from 'styled-components';
import { PostContainer } from './_post.elements';

export const InfoContainer = styled(PostContainer)`
  ul {
    list-style: none;
    margin: 0;
  }
`;

export const GuestInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Audio = styled.iframe`

  margin:0 0 2rem 0;
  widh:300px;
  background:#F2F2F2;
  border-radius: 0.125rem;
}

`;

export const TranscriptButton = styled.button`
  background: #242424;
  border-radius: 0.125rem;
  border: none;
  font-size: 0.8125em;
  line-height: 19px;
  text-align: center;
  padding: 8px 24px;
  font-weight: 500;
  text-decoration: none;
  color: #fff;
  transition: all 200ms ease;
  box-shadow: 0px 2px 4px rgb(0 0 0 / 10%);
  width: 100%;
  cursor: pointer;
  margin: 32px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 100ms ease;

  ${props =>
    props.open &&
    `
    svg {
      transform: rotate(45deg);
    }
  `}
`;
