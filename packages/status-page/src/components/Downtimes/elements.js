import styled, { keyframes, css } from 'styled-components';

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

export const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: 2px;
  background: #30d158;
  margin-right: 0.25rem;
`;

export const Tooltip = styled.div`
  transition: all 200ms ease;
  transition-delay: 0.1s;
  position: absolute;
  background: ${props => props.theme.white};
  border-radius: 0.25rem;
  box-shadow: 0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25),
    0px 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  opacity: 0;
  color: #000;
  transform: translateY(100%) translateX(-50%);
  bottom: -10px;
  min-width: 120px;
  margin-left: 4px;

  :after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: ${props => props.theme.white};
    border-width: 8px;
    margin-left: -8px;
  }
`;

export const Info = styled.span`
  font-size: 12px;
  color: #000000;
  display: block;
  font-weight: ${props => (props.bold ? 500 : 400)};

  &:last-of-type {
    margin-top: 0.25rem;
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

export const Legend = styled.div`
  display: flex;
  padding-top: 1rem;
  margin-top: 56px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  li:not(:last-child) {
    margin-right: 30px;
  }
`;

export const LegendLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
`;

export const Dot = styled.div`
  width: 1rem;
  height: 1rem;
  background: ${props => (props.down ? '#F59300' : '#30d158')};
  border-radius: 50%;
  margin-right: 0.5rem;
`;
