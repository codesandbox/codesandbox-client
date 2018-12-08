import styled, { css } from 'styled-components';
import NextIcon from 'react-icons/lib/md/navigate-next';
import PrevIcon from 'react-icons/lib/md/navigate-before';
import Title from 'app/components/Title';

export const Name = styled(Title)`
  text-align: left;
  font-size: 2rem;
  font-weight: 400;
`;

export const ModalContainer = styled.div`
  background-color: ${props => props.theme.background};
  position: relative;
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

export const Content = styled.section`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 60px;
`;

export const Tag = styled.span`
  position: relative;
  color: white;
  background-color: ${props => props.theme.secondary};
  padding: 0.3em 0.5em;
  border-radius: 4px;
  font-weight: 500;
`;

export const Author = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  > section {
    display: flex;
    flex-direction: column;
  }

  > img {
    border-radius: 50%;
    margin-right: 0.5rem;
  }
`;
