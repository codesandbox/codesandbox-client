import styled from 'styled-components';

export const Title = styled.h3`
  font-family: 'Poppins', 'Roboto', sans-serif;
  font-weight: 600;
  width: 60%;
  font-size: 24px;
  line-height: 36px;

  color: ${props => props.theme.white};
`;

export const Empty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
