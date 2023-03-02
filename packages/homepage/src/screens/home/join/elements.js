import styled from 'styled-components';

export const JoinWrapper = styled.section`
  margin-top: 13.5rem;
  display: flex;
  width: 100%;
  text-align: center;
  background: #151515;
  min-height: 322px;
  position: relative;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.theme.homepage.greyDark};
  overflow: hidden;

  ${props => props.theme.breakpoints.lg} {
    display: flex;
    min-height: 212px;
  }

  ${props => props.theme.breakpoints.md} {
    padding: 2rem;
  }
`;

export const IDE = styled.img`
  box-shadow: 0 0.24rem 0.5rem rgba(0, 0, 0, 0.24);

  ${props => props.theme.breakpoints.lg} {
    display: none;
  }
`;

export const Text = styled.h3`
  font-weight: 500;
  font-size: 36px;
  line-height: 43px;
  font-family: ${props => props.theme.homepage.appleFont};
  color: ${props => props.theme.homepage.white};
  max-width: 80%;
  margin: auto;
  margin-bottom: 2.5rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 1.8rem;
    line-height: 1.2;
  }
`;
