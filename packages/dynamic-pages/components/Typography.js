import styled from 'styled-components';

export const H3 = styled.h3`
  font-family: Poppins;
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -0.04em;
  color: ${props => props.theme.new.title};
  margin-bottom: 10px;
`;

export const H4 = styled.h4`
  font-family: Poppins;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  font-size: 20px;
  letter-spacing: -0.04em;

  color: ${props => props.theme.new.title.clearer(0.3)};
`;
