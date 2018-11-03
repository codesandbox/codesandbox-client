import styled, { css } from 'styled-components';
import Title from 'app/components/Title';
import NextIcon from 'react-icons/lib/md/navigate-next';
import PrevIcon from 'react-icons/lib/md/navigate-before';

export const Heading = styled(Title)`
  margin-top: 7rem;
  font-weight: bold;
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 60px;
  grid-row-gap: 60px;
  margin-top: 350px;
`;

export const FancyHeader = styled.section`
  position: absolute;
  height: 300px;
  top: 0;
  width: 100vw;
  left: 0;
  z-index: 0;
  border-radius: 10% 10% 50% 50% / 0% 0% 31% 34%;
  box-shadow: 0 0 14px 15px rgba(0, 0, 0, 0.08);
  background: #48b2f5;
`;

export const ModalContainer = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  padding-top: 0.75rem;

  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Icon = css`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const NextIconStyled = styled(NextIcon)`
  ${Icon};
  right: -50px;
`;
export const PrevIconStyled = styled(PrevIcon)`
  ${Icon};
  left: -50px;
`;
