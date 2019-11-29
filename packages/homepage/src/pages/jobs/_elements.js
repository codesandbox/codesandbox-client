import styled from 'styled-components';

export const PageTitle = styled.h1`
  font-weight: 600;
  font-size: 36px;
  color: ${props => props.theme.white};
`;

export const PageSubtitle = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 1.5;
  color: ${props => props.theme.white};
`;

export const TitleDescription = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5;
  color: ${props => props.theme.lightText};
  margin-bottom: 120px;
`;

export const Job = styled.li`
  list-style: none;
  font-weight: 400;
  font-size: 18px;
  line-height: 33px;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
  color: ${props => props.theme.lightText};
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    font-size: 14px;
    min-width: 100px;
    line-height: 1;
  }
`;

export const Jobs = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: 50px;
`;

export const OtherJobs = styled.div`
  display: flex;
  color: ${props => props.theme.lightText};
  font-size: 14px;
  margin-top: 12px;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 3rem;

  align-items: flex-start;

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }

  p {
    max-width: 70%;

    @media screen and (max-width: 500px) {
      max-width: 100%;
    }
  }
`;
