import styled from 'styled-components';

export const Container = styled.div`
  margin: 8rem auto;
  width: 940px;
  padding: 1rem;
  background-color: ${props => props.theme.background};

  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 6rem;

  > div {
    flex: 1;
  }
`;

export const Title = styled.h3`
  font-weight: 300;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-top: 0;
`;
