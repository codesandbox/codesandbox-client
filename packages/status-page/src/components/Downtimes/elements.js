import styled, { keyframes, css } from 'styled-components';
import { Tooltip } from '../Tooltip/elements';

export const Alias = styled.h3`
  margin: 0;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  color: ${props => props.theme.white};
`;

export const Data = styled.span`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  text-align: right;

  color: rgba(255, 255, 255, 0.4);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  justify-content: space-between;
  width: 100%;
`;

export const Services = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 60px;
  padding-top: 60px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Service = styled.li`
  display: flex;
  flex-direction: column;
`;

const colorChange = keyframes`
  from {
    background: rgba(255,255,255,0.4)
  } to {
      background: ${props => (props.down ? '#F59300' : '#30d158')};
  }
`;

export const Status = styled.div`
  transition: all 0.3s ease;
  ${props =>
    !props.loading &&
    css`
      animation: ${colorChange} 1s;
    `}
  background: ${props => {
    if (props.loading) {
      return 'rgba(255,255,255,0.4)';
    }

    return props.down ? '#F59300' : '#30d158';
  }};
  width: 0.5rem;
  height: 40px;

  &:hover {
    transform: scaleY(1.2);

    + ${Tooltip} {
opacity: 1;
    }
  }
`;

export const AllStatus = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 0.5rem);
  justify-content: space-between;
  cursor: pointer;
  position: relative;
`;
