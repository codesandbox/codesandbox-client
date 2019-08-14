import styled from 'styled-components';

export const Title = styled.h1`
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  color: ${props => props.theme.white};
  margin: 0;
`;

export const LastCheck = styled.span`
  line-height: 1.5rem;

  color: rgba(255, 255, 255, 0.6);
`;

export const Circle = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  transition: all 1s ease;

  background: ${props => {
    if (props.loading) {
      return 'rgba(255,255,255,0.4)';
    }

    return props.down ? '#F59300' : '#30d158';
  }};
`;

export const HeaderStyled = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Percent = styled.h2`
  margin: 0;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: right;
  color: ${props => props.theme.white};
  margin-right: 0.5rem;
`;

export const Visual = styled.div`
  display: flex;
  align-items: center;
`;
